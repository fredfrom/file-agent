export interface DocumentViewerData {
  path: string;
  folder: string;
  filename: string;
  extension: string;
  content: string;
  createdAt: string; // ISO string
}

export interface CitationInfo {
  path: string;
  passage?: string;
}
