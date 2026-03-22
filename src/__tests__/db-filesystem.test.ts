import { describe, it, expect, vi, beforeEach } from "vitest";
import { Bash } from "just-bash";
import { AccessLogger } from "@/lib/filesystem/access-logger";
import { LruContentCache } from "@/lib/filesystem/lru-cache";

// Mock the DB queries module
vi.mock("@/lib/db/queries", () => ({
  getAllVirtualPaths: vi.fn(),
  getDocumentContent: vi.fn(),
}));

// Mock prisma client for AccessLogger flush
vi.mock("@/lib/db/client", () => ({
  prisma: {
    accessLog: {
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  },
}));

import { createDbFilesystem } from "@/lib/filesystem/db-filesystem";
import { getAllVirtualPaths, getDocumentContent } from "@/lib/db/queries";

const MOCK_PROJECT_ID = "00000000-0000-0000-0000-000000000001";
const MOCK_PATHS = [
  "/01_vertraege/auftraggeber/hauptvertrag.pdf",
  "/02_nachtraege/nt_001_fassade.txt",
  "/03_protokolle/baubesprechung_001.txt",
];
const MOCK_CONTENT: Record<string, string> = {
  "/01_vertraege/auftraggeber/hauptvertrag.pdf": "Hauptvertrag Inhalt",
  "/02_nachtraege/nt_001_fassade.txt": "Nachtrag NT-001 Fassade",
  "/03_protokolle/baubesprechung_001.txt": "Protokoll Baubesprechung 1",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAllVirtualPaths).mockResolvedValue(MOCK_PATHS);
  vi.mocked(getDocumentContent).mockImplementation(
    async (_pid: string, vpath: string) => MOCK_CONTENT[vpath] ?? null
  );
});

describe("FS-01: lazy-loading filesystem init", () => {
  it("returns bash, paths, and accessLogger", async () => {
    const result = await createDbFilesystem(MOCK_PROJECT_ID);
    expect(result.bash).toBeInstanceOf(Bash);
    expect(result.paths).toEqual(MOCK_PATHS);
    expect(result.accessLogger).toBeInstanceOf(AccessLogger);
  });

  it("does not fetch any content during init", async () => {
    await createDbFilesystem(MOCK_PROJECT_ID);
    expect(getDocumentContent).not.toHaveBeenCalled();
  });

  it("ls / shows all top-level folders without fetching content", async () => {
    const { bash } = await createDbFilesystem(MOCK_PROJECT_ID);
    const result = await bash.exec("ls /");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("01_vertraege");
    expect(result.stdout).toContain("02_nachtraege");
    expect(result.stdout).toContain("03_protokolle");
    expect(getDocumentContent).not.toHaveBeenCalled();
  });
});

describe("FS-02: lazy content fetching on cat/grep", () => {
  it("cat triggers getDocumentContent for that file only", async () => {
    const { bash } = await createDbFilesystem(MOCK_PROJECT_ID);
    const result = await bash.exec(
      "cat /01_vertraege/auftraggeber/hauptvertrag.pdf"
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Hauptvertrag Inhalt");
    expect(getDocumentContent).toHaveBeenCalledTimes(1);
    expect(getDocumentContent).toHaveBeenCalledWith(
      MOCK_PROJECT_ID,
      "/01_vertraege/auftraggeber/hauptvertrag.pdf"
    );
  });

  it("find does not trigger content fetch", async () => {
    const { bash } = await createDbFilesystem(MOCK_PROJECT_ID);
    const result = await bash.exec('find / -name "*.txt"');
    expect(result.exitCode).toBe(0);
    expect(getDocumentContent).not.toHaveBeenCalled();
  });
});

describe("FS-03: session-scoped caching", () => {
  it("second cat on same file does not re-fetch from DB", async () => {
    const { bash } = await createDbFilesystem(MOCK_PROJECT_ID);
    await bash.exec("cat /01_vertraege/auftraggeber/hauptvertrag.pdf");
    await bash.exec("cat /01_vertraege/auftraggeber/hauptvertrag.pdf");
    expect(getDocumentContent).toHaveBeenCalledTimes(1);
  });
});

describe("FS-04: access logging", () => {
  it("records access entry after cat", async () => {
    const { bash, accessLogger } = await createDbFilesystem(MOCK_PROJECT_ID);
    await bash.exec("cat /02_nachtraege/nt_001_fassade.txt");
    const entries = accessLogger.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].virtualPath).toBe("/02_nachtraege/nt_001_fassade.txt");
    expect(entries[0].source).toBe("db");
    expect(entries[0].order).toBe(0);
  });

  it("records multiple accesses in order", async () => {
    const { bash, accessLogger } = await createDbFilesystem(MOCK_PROJECT_ID);
    await bash.exec("cat /01_vertraege/auftraggeber/hauptvertrag.pdf");
    await bash.exec("cat /02_nachtraege/nt_001_fassade.txt");
    const entries = accessLogger.getEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0].order).toBe(0);
    expect(entries[1].order).toBe(1);
  });

  it("does not record entry for ls (no content fetch)", async () => {
    const { bash, accessLogger } = await createDbFilesystem(MOCK_PROJECT_ID);
    await bash.exec("ls /");
    expect(accessLogger.getEntries()).toHaveLength(0);
  });
});

describe("LRU cache cap", () => {
  it("stops fetching content when cap is reached", async () => {
    const { bash } = await createDbFilesystem(MOCK_PROJECT_ID, { maxSize: 1 });
    // First file: should fetch
    await bash.exec("cat /01_vertraege/auftraggeber/hauptvertrag.pdf");
    expect(getDocumentContent).toHaveBeenCalledTimes(1);
    // Second file: cap reached, should return empty string
    const result = await bash.exec("cat /02_nachtraege/nt_001_fassade.txt");
    expect(result.stdout.trim()).toBe("");
    expect(getDocumentContent).toHaveBeenCalledTimes(1);
  });
});

describe("AccessLogger unit tests", () => {
  it("flush calls prisma.accessLog.createMany", async () => {
    const { prisma } = await import("@/lib/db/client");
    const logger = new AccessLogger(MOCK_PROJECT_ID);
    logger.record("/test/file.txt", "db");
    await logger.flush();
    expect(prisma.accessLog.createMany).toHaveBeenCalledTimes(1);
  });

  it("flush with no entries does not call prisma", async () => {
    const { prisma } = await import("@/lib/db/client");
    const logger = new AccessLogger(MOCK_PROJECT_ID);
    await logger.flush();
    expect(prisma.accessLog.createMany).not.toHaveBeenCalled();
  });

  it("getSessionId returns a UUID string", () => {
    const logger = new AccessLogger(MOCK_PROJECT_ID);
    expect(logger.getSessionId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });
});

describe("LruContentCache unit tests", () => {
  it("defaults to DEFAULT_CACHE_CAP", () => {
    const cache = new LruContentCache();
    expect(cache.cap).toBe(100);
  });

  it("canMaterialize returns false when at cap", () => {
    const cache = new LruContentCache({ maxSize: 2 });
    cache.markMaterialized("/a.txt");
    cache.markMaterialized("/b.txt");
    expect(cache.canMaterialize()).toBe(false);
  });

  it("tracks size correctly", () => {
    const cache = new LruContentCache();
    expect(cache.size).toBe(0);
    cache.markMaterialized("/a.txt");
    expect(cache.size).toBe(1);
  });
});
