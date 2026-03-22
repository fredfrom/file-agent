import { Bash, InMemoryFs } from "just-bash";
import { getAllVirtualPaths, getDocumentContent } from "@/lib/db/queries";
import { AccessLogger } from "./access-logger";
import { LruContentCache } from "./lru-cache";
import type { DbFilesystemResult, LruCacheOptions } from "./types";

export async function createDbFilesystem(
  projectId: string,
  cacheOptions?: Partial<LruCacheOptions>
): Promise<DbFilesystemResult> {
  const paths = await getAllVirtualPaths(projectId);
  const fs = new InMemoryFs({});
  const accessLogger = new AccessLogger(projectId);
  const lruCache = new LruContentCache(cacheOptions);

  for (const virtualPath of paths) {
    fs.writeFileLazy(virtualPath, async () => {
      if (!lruCache.canMaterialize()) {
        return "";
      }
      const content = await getDocumentContent(projectId, virtualPath);
      lruCache.markMaterialized(virtualPath);
      accessLogger.record(virtualPath, "db");
      return content ?? "";
    });
  }

  const bash = new Bash({ fs, cwd: "/" });
  return { bash, paths, accessLogger };
}
