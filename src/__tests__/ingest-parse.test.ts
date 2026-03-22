import { describe, it, expect } from 'vitest';
import { parsePdf, parseExcel, parsePlainText, parseByExtension } from '@/lib/ingest/parse';
import ExcelJS from 'exceljs';

describe('parsePlainText', () => {
  it('returns UTF-8 string from buffer', () => {
    const result = parsePlainText(Buffer.from('Hallo Welt'));
    expect(result).toBe('Hallo Welt');
  });

  it('handles UTF-8 characters correctly', () => {
    const result = parsePlainText(Buffer.from('Umlaut: ae oe ue ss'));
    expect(result).toBe('Umlaut: ae oe ue ss');
  });
});

describe('parsePdf', () => {
  it('returns a string without throwing for a minimal PDF buffer', async () => {
    const minimalPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n' +
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n' +
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n' +
      '4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello PDF) Tj ET\nendstream\nendobj\n' +
      'xref\n0 5\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n0\n%%EOF'
    );
    const result = await parsePdf(minimalPdf);
    expect(typeof result).toBe('string');
  });
});

describe('parseByExtension', () => {
  it('dispatches .txt to parsePlainText', async () => {
    const result = await parseByExtension('test.txt', Buffer.from('content'));
    expect(result).toBe('content');
  });

  it('dispatches .svg to parsePlainText', async () => {
    const result = await parseByExtension('plan.svg', Buffer.from('<svg>test</svg>'));
    expect(result).toBe('<svg>test</svg>');
  });

  it('dispatches .pdf and returns a string', async () => {
    const minimalPdf = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n' +
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n' +
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n' +
      '4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello PDF) Tj ET\nendstream\nendobj\n' +
      'xref\n0 5\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n0\n%%EOF'
    );
    const result = await parseByExtension('document.pdf', minimalPdf);
    expect(typeof result).toBe('string');
  });

  it('wirft Fehler bei nicht unterstuetztem Dateiformat', async () => {
    await expect(
      parseByExtension('file.doc', Buffer.from('x'))
    ).rejects.toThrow('Nicht unterstuetztes Dateiformat');
  });
});

describe('parseExcel', () => {
  it('parses XLSX buffer to tab-separated text with sheet names', async () => {
    // Create a minimal XLSX in memory using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tabelle1');
    sheet.addRow(['Pos', 'Beschreibung', 'Betrag']);
    sheet.addRow([1, 'Rohbau', 50000]);

    const xlsxBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
    const result = await parseExcel(xlsxBuffer);

    expect(result).toContain('=== Tabelle1 ===');
    expect(result).toContain('Pos\tBeschreibung\tBetrag');
    expect(result).toContain('1\tRohbau\t50000');
  });
});
