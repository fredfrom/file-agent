import path from 'node:path';
import { join } from 'node:path';
import { PDFParse } from 'pdf-parse';
import ExcelJS from 'exceljs';
import { ACCEPTED_EXTENSIONS, type AcceptedExtension } from './constants';

// Point pdfjs-dist worker to the actual file in node_modules to avoid
// Turbopack relative resolution issues with the default "./pdf.worker.mjs".
PDFParse.setWorker(
  join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
);

/**
 * Parse a PDF buffer to plain text using pdf-parse v2 PDFParse class.
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

/**
 * Parse an XLSX buffer to tab-separated text.
 * Each sheet is prefixed with "=== SheetName ===" header.
 * Row values are joined with tabs, rows with newlines.
 */
export async function parseExcel(buffer: Buffer): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  const lines: string[] = [];

  workbook.eachSheet((sheet) => {
    lines.push(`=== ${sheet.name} ===`);
    sheet.eachRow((row) => {
      const cells = (row.values as (string | number | undefined)[]).slice(1);
      lines.push(
        cells
          .map((c) => (c === undefined || c === null ? '' : String(c)))
          .join('\t')
      );
    });
  });

  return lines.join('\n');
}

/**
 * Parse a plain text or SVG buffer to UTF-8 string.
 */
export function parsePlainText(buffer: Buffer): string {
  return buffer.toString('utf-8');
}

/**
 * Dispatch parsing by file extension.
 * Supports: pdf, xlsx, svg, txt.
 * Throws for unsupported extensions with a German error message.
 */
export async function parseByExtension(
  filename: string,
  buffer: Buffer
): Promise<string> {
  const ext = path.extname(filename).slice(1).toLowerCase() as AcceptedExtension;

  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    throw new Error(`Nicht unterstuetztes Dateiformat: ${ext || 'unbekannt'}`);
  }

  switch (ext) {
    case 'pdf':
      return parsePdf(buffer);
    case 'xlsx':
      return parseExcel(buffer);
    case 'svg':
    case 'txt':
      return parsePlainText(buffer);
  }
}

/**
 * Parse a virtual path into folder, filename, and extension components.
 * Replicates the logic from prisma/seed.ts.
 */
export function parseVirtualPath(virtualPath: string): {
  folder: string;
  filename: string;
  extension: string;
} {
  const segments = virtualPath.split('/').filter(Boolean);
  const fullFilename = segments[segments.length - 1];
  const folder = '/' + segments.slice(0, -1).join('/');
  const ext = path.extname(fullFilename);
  const extension = ext.slice(1);
  const filename = path.basename(fullFilename, ext);
  return { folder, filename, extension };
}

/**
 * Build a virtual path from a folder and original filename.
 * Folder already starts with /.
 */
export function buildVirtualPath(folder: string, originalFilename: string): string {
  return `${folder}/${originalFilename}`;
}
