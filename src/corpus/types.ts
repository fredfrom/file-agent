/**
 * Virtual filesystem for the construction project.
 * Keys are absolute file paths (e.g., '/01_vertraege/auftraggeber/hauptvertrag.txt').
 * Values are file content strings.
 * Empty string values indicate placeholder files (content added in Phase 3).
 */
export type ProjectFilesystem = Record<string, string>;
