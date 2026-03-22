/**
 * Parse tab-delimited content (from XLSX conversion) into structured sheet data.
 * Supports multiple sheets separated by === SheetName === markers.
 */
export function parseTabularContent(content: string): {
  sheets: { name: string; rows: string[][] }[];
} {
  const parts = content.split(/^=== (.+) ===$/m);

  // No sheet markers found -- treat entire content as single sheet
  if (parts.length === 1) {
    return {
      sheets: [
        {
          name: 'Tabelle',
          rows: parseRows(content),
        },
      ],
    };
  }

  // parts[0] is text before first marker (usually empty), then alternating name/content
  const sheets: { name: string; rows: string[][] }[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i].trim();
    const block = parts[i + 1] || '';
    sheets.push({
      name,
      rows: parseRows(block),
    });
  }

  return { sheets };
}

function parseRows(block: string): string[][] {
  return block
    .trim()
    .split('\n')
    .map((line) => line.split('\t'))
    .filter((row) => row.join('').trim() !== '');
}
