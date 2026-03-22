import { prisma } from "@/lib/db/client";
import { randomUUID } from "crypto";
import type { AccessLogEntry } from "./types";

export class AccessLogger {
  private entries: AccessLogEntry[] = [];
  private counter = 0;
  private readonly sessionId: string;

  constructor(private readonly projectId: string) {
    this.sessionId = randomUUID();
  }

  record(virtualPath: string, source: "db"): void {
    this.entries.push({
      virtualPath,
      source,
      timestamp: new Date(),
      order: this.counter++,
    });
  }

  getEntries(): ReadonlyArray<AccessLogEntry> {
    return this.entries;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  async flush(): Promise<void> {
    if (this.entries.length === 0) return;
    await prisma.accessLog.createMany({
      data: this.entries.map((e) => ({
        projectId: this.projectId,
        virtualPath: e.virtualPath,
        source: e.source,
        accessedAt: e.timestamp,
        accessOrder: e.order,
        sessionId: this.sessionId,
      })),
    });
    this.entries = [];
  }
}
