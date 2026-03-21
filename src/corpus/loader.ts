/**
 * Async corpus loader that merges parsed real-format files (PDF, Excel, SVG)
 * with inline text documents from filesystem.ts.
 *
 * Usage:
 *   import { loadCorpus } from './loader';
 *   const corpus = await loadCorpus();
 *   // corpus is Record<string, string> with .pdf, .xlsx, .svg keys
 *
 * Design:
 * - PDF files are parsed to text via pdf-parse v2
 * - Excel files are parsed to tab-separated text via exceljs
 * - SVG files are read as UTF-8 strings (they are text-based XML)
 * - Real-format entries replace their .txt counterparts in the corpus
 * - SVG entries coexist alongside their .txt metadata files
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import ExcelJS from 'exceljs';
import type { ProjectFilesystem } from './types';
import { files as textFiles } from './filesystem';

const DOCS_DIR = path.resolve(process.cwd(), 'src/corpus/documents');

/**
 * Map of virtual filesystem paths to disk file paths and the .txt key they replace.
 * PDF and Excel files replace their .txt counterparts; the old .txt key is removed.
 */
const REAL_FILES: Record<string, { diskPath: string; replaces: string }> = {
  '/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf': {
    diskPath: '01_vertraege/hauptvertrag_stadtpark_ag.pdf',
    replaces: '/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.txt',
  },
  '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.pdf': {
    diskPath: '01_vertraege/vertrag_rohbau_mueller_bau.pdf',
    replaces: '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.txt',
  },
  '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.xlsx': {
    diskPath: '08_rechnungen/re_mueller_bau_abschlag_01.xlsx',
    replaces: '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.txt',
  },
};

/**
 * SVG drawing files that are added as new entries alongside existing .txt metadata.
 * These do NOT replace .txt keys -- both coexist.
 */
const SVG_FILES: Record<string, string> = {
  '/05_plaene/grundrisse/grundriss_eg_v3.svg':
    '05_plaene/grundrisse/grundriss_eg_v3.svg',
  '/05_plaene/grundrisse/grundriss_og1_v2.svg':
    '05_plaene/grundrisse/grundriss_og1_v2.svg',
  '/05_plaene/schnitte/laengsschnitt_a_a.svg':
    '05_plaene/schnitte/laengsschnitt_a_a.svg',
};

/**
 * Extract plain text from a PDF buffer using pdf-parse v2.
 * Always destroys the parser instance to prevent memory leaks.
 */
async function parsePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

/**
 * Convert an Excel buffer to tab-separated text.
 * Each sheet is prefixed with "=== SheetName ===" header.
 * Row values are joined with tabs, rows with newlines.
 */
async function parseExcel(buffer: Buffer): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
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
 * Load the complete project corpus, merging inline text documents with
 * parsed real-format files from disk.
 *
 * Returns a ProjectFilesystem (Record<string, string>) where:
 * - Most entries come from filesystem.ts (inline text)
 * - PDF/Excel entries replace their .txt counterparts with parsed text content
 * - SVG entries are added alongside their .txt metadata
 */
export async function loadCorpus(): Promise<ProjectFilesystem> {
  const corpus: ProjectFilesystem = { ...textFiles };

  // Parse and replace real-format files (PDF, Excel)
  for (const [virtualPath, { diskPath, replaces }] of Object.entries(
    REAL_FILES
  )) {
    const fullPath = path.resolve(DOCS_DIR, diskPath);
    const buffer = await readFile(fullPath);
    const ext = path.extname(diskPath).toLowerCase();

    let content: string;
    if (ext === '.pdf') {
      content = await parsePdf(buffer);
    } else if (ext === '.xlsx') {
      content = await parseExcel(buffer);
    } else {
      content = buffer.toString('utf-8');
    }

    // Remove old .txt key and add new real-format key
    delete corpus[replaces];
    corpus[virtualPath] = content;
  }

  // Add SVG drawing files (coexist with .txt metadata)
  for (const [virtualPath, diskRelPath] of Object.entries(SVG_FILES)) {
    const fullPath = path.resolve(DOCS_DIR, diskRelPath);
    const content = await readFile(fullPath, 'utf-8');
    corpus[virtualPath] = content;
  }

  return corpus;
}
