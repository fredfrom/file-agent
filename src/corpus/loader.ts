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
import { parseExcel } from '@/lib/ingest/parse';
import type { ProjectFilesystem } from './types';
import { files as textFiles } from './filesystem';

const DOCS_DIR = path.resolve(process.cwd(), 'src/corpus/documents');

/**
 * Map of virtual filesystem paths to disk file paths and the .txt key they replace.
 * PDF and Excel files replace their .txt counterparts; the old .txt key is removed.
 */
const REAL_FILES: Record<string, { diskPath: string; replaces: string; format: 'text' | 'excel' }> = {
  '/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf': {
    diskPath: '01_vertraege/hauptvertrag_stadtpark_ag.txt',
    replaces: '/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.txt',
    format: 'text',
  },
  '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.pdf': {
    diskPath: '01_vertraege/vertrag_rohbau_mueller_bau.txt',
    replaces: '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.txt',
    format: 'text',
  },
  '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.xlsx': {
    diskPath: '08_rechnungen/re_mueller_bau_abschlag_01.xlsx',
    replaces: '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.txt',
    format: 'excel',
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

  // Parse and replace real-format files (pre-parsed text, Excel)
  for (const [virtualPath, { diskPath, replaces, format }] of Object.entries(
    REAL_FILES
  )) {
    const fullPath = path.resolve(DOCS_DIR, diskPath);

    let content: string;
    if (format === 'excel') {
      const buffer = await readFile(fullPath);
      content = await parseExcel(buffer);
    } else {
      content = await readFile(fullPath, 'utf-8');
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
