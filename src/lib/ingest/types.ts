export interface UploadFileResult {
  filename: string;
  success: boolean;
  virtualPath?: string;
  error?: string;
}

export interface IngestResponse {
  results: UploadFileResult[];
}

export interface DocumentListItem {
  id: string;
  virtualPath: string;
  folder: string;
  filename: string;
  extension: string;
  charCount: number;
  createdAt: string;
}
