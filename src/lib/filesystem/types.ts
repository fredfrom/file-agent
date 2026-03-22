import type { Bash } from "just-bash";
import type { AccessLogger } from "./access-logger";

export interface DbFilesystemResult {
  bash: InstanceType<typeof Bash>;
  paths: string[];
  accessLogger: AccessLogger;
}

export interface AccessLogEntry {
  virtualPath: string;
  /**
   * Source is narrowed to "db" only (not "db" | "cache") because InMemoryFs
   * caches content internally after the first writeFileLazy factory call.
   * The factory only fires once per path per session, so every factory
   * invocation is a DB fetch. There is no separate "cache hit" at the
   * factory level -- caching is invisible, handled by InMemoryFs itself.
   * See research Pitfall 4.
   */
  source: "db";
  timestamp: Date;
  order: number;
}

export interface LruCacheOptions {
  maxSize: number;
}

export const DEFAULT_CACHE_CAP = 100;
