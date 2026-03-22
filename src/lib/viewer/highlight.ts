/**
 * Find the index of a passage within content, with whitespace normalization
 * and partial match fallback.
 */
export function findPassageIndex(content: string, passage: string): number {
  if (!passage || !passage.trim()) {
    return -1;
  }

  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();

  const normalizedContent = normalize(content);
  const normalizedPassage = normalize(passage);

  // Try exact normalized match
  const exactIndex = normalizedContent.indexOf(normalizedPassage);
  if (exactIndex >= 0) {
    return exactIndex;
  }

  // Partial match fallback: try first 50 chars of passage
  const partial = normalizedPassage.slice(0, 50);
  if (partial.length > 0) {
    return normalizedContent.indexOf(partial);
  }

  return -1;
}
