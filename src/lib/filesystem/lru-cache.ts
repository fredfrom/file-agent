import type { LruCacheOptions } from "./types";
import { DEFAULT_CACHE_CAP } from "./types";

export class LruContentCache {
  private readonly maxSize: number;
  private materialized = new Set<string>();

  constructor(options?: Partial<LruCacheOptions>) {
    this.maxSize = options?.maxSize ?? DEFAULT_CACHE_CAP;
  }

  canMaterialize(): boolean {
    return this.materialized.size < this.maxSize;
  }

  markMaterialized(path: string): void {
    this.materialized.add(path);
  }

  has(path: string): boolean {
    return this.materialized.has(path);
  }

  get size(): number {
    return this.materialized.size;
  }

  get cap(): number {
    return this.maxSize;
  }
}
