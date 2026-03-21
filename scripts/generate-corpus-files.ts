/**
 * One-time script to generate real-format corpus files (PDF, Excel, SVG).
 * Run with: npx tsx scripts/generate-corpus-files.ts
 *
 * Creates:
 * - 2 PDF contracts in src/corpus/documents/01_vertraege/
 * - 1 Excel invoice in src/corpus/documents/08_rechnungen/
 * - 3 SVG drawings in src/corpus/documents/05_plaene/
 */

import PDFDocument from 'pdfkit';
import { createWriteStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ExcelJS from 'exceljs';

const DOCS_DIR = path.resolve(process.cwd(), 'src/corpus/documents');

// --- PDF Generation ---

const HAUPTVERTRAG_TEXT = `BAUVERTRAG (HAUPTVERTRAG)
Vertragsnummer: V-2024-001
Datum: 15.12.2023

Auftraggeber (AG):
  Stadtpark Immobilien AG
  Kurfuerstendamm 42, 10719 Berlin
  Vertreten durch: Dr. Klaus Richter, Vorstand

Auftragnehmer (AN):
  Hochbau Schmidt GmbH
  Berliner Strasse 17, 10715 Berlin
  Vertreten durch: Thomas Schmidt, Geschaeftsfuehrer

1. Vertragsgegenstand
Sanierung eines 12-geschossigen Hochhauses (Baujahr 1972) am Stadtpark,
Berlin-Charlottenburg. Umfassende Kernsanierung inkl. Rohbau, Fassade,
Haustechnik und Innenausbau gemaess Leistungsverzeichnis vom 01.11.2023.

2. Auftragssumme
Pauschalpreis: 3.200.000,00 EUR netto zzgl. gesetzlicher MwSt.
Zahlungsplan gemaess Anlage 3 (monatliche Abschlagszahlungen).

3. Vertragsgrundlagen (in der Rangfolge)
a) Dieses Vertragswerk
b) VOB/B 2016 (Vergabe- und Vertragsordnung fuer Bauleistungen, Teil B)
c) VOB/C 2019 (Allgemeine Technische Vertragsbedingungen)
d) Leistungsverzeichnis vom 01.11.2023
e) Plaene und Zeichnungen gemaess Planlieferliste Anlage 2

4. Bauzeit
Baubeginn: 01.01.2024
Fertigstellung: 30.09.2024
Zwischentermine gemaess Bauzeitenplan Anlage 4.

5. Vertragsstrafen (gem. ss 11 VOB/B)
0,2% der Auftragssumme je Werktag Verzug, max. 5% der Auftragssumme.

6. Gewaehrleistung (gem. ss 13 VOB/B)
Gewaehrleistungsfrist: 5 Jahre ab foermlicher Abnahme.

7. Sicherheitsleistungen
Vertragserfuellungsbuergschaft: 5% der Auftragssumme (160.000,00 EUR).
Gewaehrleistungsbuergschaft: 3% der Auftragssumme (96.000,00 EUR).

8. Architektenleistung
Objektueberwachung (LP 8 HOAI) durch Architekturbuero Hoffmann + Partner.
Ansprechpartnerin: Maria Hoffmann, Architektin.

Berlin, den 15.12.2023

_________________________          _________________________
Dr. Klaus Richter                  Thomas Schmidt
Stadtpark Immobilien AG            Hochbau Schmidt GmbH`;

const VERTRAG_ROHBAU_TEXT = `NACHUNTERNEHMERVERTRAG ROHBAUARBEITEN
Vertragsnummer: V-2024-002
Datum: 18.12.2023

Auftraggeber (GU):
  Hochbau Schmidt GmbH (Thomas Schmidt, Geschaeftsfuehrer)
  Berliner Strasse 17, 10715 Berlin

Auftragnehmer (NU):
  Mueller Bau GmbH & Co. KG (Hans Mueller, Polier/Prokurist)
  Industriestrasse 5, 12099 Berlin

Bezug: Hauptvertrag V-2024-001 (Stadtpark Immobilien AG / Hochbau Schmidt)
Projekt: Sanierung Hochhaus am Stadtpark, Berlin-Charlottenburg

1. Leistungsumfang
Komplette Rohbauarbeiten gemaess LV Positionen 01.01 bis 01.48:
- Abbruch und Rueckbau bestehender Bauteile (DIN 18299)
- Betonarbeiten und Stahlbetonarbeiten (DIN 18331)
- Mauerwerksarbeiten (DIN 18330)
- Abdichtungsarbeiten Tiefgarage und Kellergeschoss

2. Auftragssumme
Einheitspreisvertrag: 890.000,00 EUR netto
Abschlagszahlungen: monatlich nach Aufmass

3. Vertragsgrundlagen
VOB/B 2016, VOB/C 2019, DIN 18299, DIN 18330, DIN 18331.
Planunterlagen Architekturbuero Hoffmann + Partner.

4. Termine
Beginn: 02.01.2024
Fertigstellung Rohbau: 30.04.2024

5. Gewaehrleistung
5 Jahre ab Abnahme gem. ss 13 VOB/B.

Berlin, den 18.12.2023

_________________________          _________________________
Thomas Schmidt                     Hans Mueller
Hochbau Schmidt GmbH               Mueller Bau GmbH & Co. KG`;

async function createContractPdf(
  content: string,
  title: string,
  outputPath: string
): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = createWriteStream(outputPath);
    doc.pipe(stream);

    // Title
    doc.font('Helvetica-Bold').fontSize(14).text(title, { align: 'center' });
    doc.moveDown();

    // Body - split content by lines and write, skipping the title line
    const lines = content.split('\n');
    const bodyLines = lines.slice(1); // skip the title since we already wrote it
    doc.font('Helvetica').fontSize(11);
    for (const line of bodyLines) {
      doc.text(line, { lineGap: 2 });
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// --- Excel Generation ---

async function createInvoiceExcel(outputPath: string): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Abschlagsrechnung');

  // Header row
  sheet.columns = [
    { header: 'Pos.', key: 'pos', width: 20 },
    { header: 'Beschreibung', key: 'beschreibung', width: 40 },
    { header: 'Menge', key: 'menge', width: 10 },
    { header: 'Einheit', key: 'einheit', width: 10 },
    { header: 'EP (EUR)', key: 'ep', width: 15 },
    { header: 'GP (EUR)', key: 'gp', width: 15 },
  ];

  // Bold header row
  sheet.getRow(1).font = { bold: true };

  // Invoice line items
  sheet.addRow({
    pos: '01.01-01.05',
    beschreibung: 'Abbrucharbeiten Bestand',
    menge: 1,
    einheit: 'psch',
    ep: 45000,
    gp: 45000,
  });
  sheet.addRow({
    pos: '02.01-02.08',
    beschreibung: 'Betonarbeiten Tiefgarage',
    menge: 1,
    einheit: 'psch',
    ep: 155000,
    gp: 155000,
  });
  sheet.addRow({
    pos: '02.09-02.12',
    beschreibung: 'Bewehrungsarbeiten Tiefgarage',
    menge: 1,
    einheit: 'psch',
    ep: 67000,
    gp: 67000,
  });

  // Empty separator row
  sheet.addRow({});

  // Metadata rows
  sheet.addRow({
    pos: 'Rechnungsnr',
    beschreibung: 'RE-2024-001',
  });
  sheet.addRow({
    pos: 'Datum',
    beschreibung: '2024-02-01',
  });
  sheet.addRow({
    pos: 'Vertrag',
    beschreibung: 'V-2024-002',
  });
  sheet.addRow({
    pos: 'Netto',
    beschreibung: '',
    menge: undefined,
    einheit: undefined,
    ep: undefined,
    gp: 267000,
  });
  sheet.addRow({
    pos: 'MwSt. 19%',
    beschreibung: '',
    menge: undefined,
    einheit: undefined,
    ep: undefined,
    gp: 50730,
  });
  sheet.addRow({
    pos: 'Brutto',
    beschreibung: '',
    menge: undefined,
    einheit: undefined,
    ep: undefined,
    gp: 317730,
  });

  // Bold totals
  sheet.getRow(10).font = { bold: true };
  sheet.getRow(11).font = { bold: true };

  await workbook.xlsx.writeFile(outputPath);
}

// --- SVG Generation ---

function createGrundrissEgSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841 594" width="841" height="594">
  <!-- Background -->
  <rect width="841" height="594" fill="#f5f5f5" stroke="#333" stroke-width="2"/>

  <!-- Title bar -->
  <text x="420" y="35" text-anchor="middle" font-size="16" font-family="Helvetica" font-weight="bold">
    GRUNDRISS ERDGESCHOSS - Plan-Nr. A-EG-001-v3
  </text>
  <text x="420" y="55" text-anchor="middle" font-size="11" font-family="Helvetica" fill="#666">
    Massstab 1:100 | Architekturbuero Hoffmann + Partner
  </text>

  <!-- Foyer -->
  <rect x="340" y="80" width="170" height="120" fill="#e8f4e8" stroke="#333" stroke-width="1.5"/>
  <text x="425" y="145" text-anchor="middle" font-size="10" font-family="Helvetica">Foyer</text>
  <text x="425" y="158" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">8,5 x 6,2 m</text>

  <!-- Treppenhaus -->
  <rect x="510" y="80" width="60" height="120" fill="#fff3e0" stroke="#333" stroke-width="1.5"/>
  <text x="540" y="140" text-anchor="middle" font-size="8" font-family="Helvetica">Treppen-</text>
  <text x="540" y="152" text-anchor="middle" font-size="8" font-family="Helvetica">haus</text>

  <!-- Aufzug -->
  <rect x="570" y="80" width="40" height="50" fill="#e3f2fd" stroke="#333" stroke-width="1.5"/>
  <text x="590" y="108" text-anchor="middle" font-size="7" font-family="Helvetica">Aufzug</text>

  <!-- GE-01 -->
  <rect x="60" y="220" width="170" height="140" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="145" y="290" text-anchor="middle" font-size="10" font-family="Helvetica">GE-01</text>

  <!-- GE-02 -->
  <rect x="240" y="220" width="170" height="140" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="325" y="290" text-anchor="middle" font-size="10" font-family="Helvetica">GE-02</text>

  <!-- GE-03 -->
  <rect x="420" y="220" width="170" height="140" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="505" y="290" text-anchor="middle" font-size="10" font-family="Helvetica">GE-03</text>

  <!-- GE-04 -->
  <rect x="600" y="220" width="170" height="140" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="685" y="290" text-anchor="middle" font-size="10" font-family="Helvetica">GE-04</text>

  <!-- Axis labels -->
  <text x="60" y="420" font-size="9" font-family="Helvetica" fill="#999">Achsraster: A-F (laengs) x 1-8 (quer), 5,40 m</text>

  <!-- Title block -->
  <rect x="541" y="470" width="280" height="100" fill="white" stroke="#333" stroke-width="1.5"/>
  <line x1="541" y1="490" x2="821" y2="490" stroke="#333" stroke-width="0.5"/>
  <text x="551" y="485" font-size="9" font-family="Helvetica" font-weight="bold">Projekt: Sanierung Hochhaus am Stadtpark</text>
  <text x="551" y="505" font-size="9" font-family="Helvetica">Plan: Grundriss Erdgeschoss</text>
  <text x="551" y="520" font-size="9" font-family="Helvetica">Plan-Nr: A-EG-001-v3</text>
  <text x="551" y="535" font-size="9" font-family="Helvetica">Massstab: 1:100 | Format: A1</text>
  <text x="551" y="550" font-size="9" font-family="Helvetica">Datum: 2024-01-28 | Version: 3</text>
  <text x="551" y="565" font-size="9" font-family="Helvetica">Ersteller: Hoffmann + Partner</text>
</svg>`;
}

function createGrundrissOg1Svg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841 594" width="841" height="594">
  <!-- Background -->
  <rect width="841" height="594" fill="#f5f5f5" stroke="#333" stroke-width="2"/>

  <!-- Title bar -->
  <text x="420" y="35" text-anchor="middle" font-size="16" font-family="Helvetica" font-weight="bold">
    GRUNDRISS 1. OG - Plan-Nr. A-OG1-001-v2
  </text>
  <text x="420" y="55" text-anchor="middle" font-size="11" font-family="Helvetica" fill="#666">
    Massstab 1:100 | Architekturbuero Hoffmann + Partner
  </text>

  <!-- Treppenhaus -->
  <rect x="370" y="80" width="60" height="100" fill="#fff3e0" stroke="#333" stroke-width="1.5"/>
  <text x="400" y="130" text-anchor="middle" font-size="8" font-family="Helvetica">Treppenhaus</text>

  <!-- Aufzug -->
  <rect x="430" y="80" width="40" height="50" fill="#e3f2fd" stroke="#333" stroke-width="1.5"/>
  <text x="450" y="108" text-anchor="middle" font-size="7" font-family="Helvetica">Aufzug</text>

  <!-- WE-101 -->
  <rect x="60" y="200" width="120" height="100" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="120" y="250" text-anchor="middle" font-size="10" font-family="Helvetica">WE-101</text>
  <text x="120" y="265" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">85 qm</text>

  <!-- WE-102 -->
  <rect x="190" y="200" width="120" height="100" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="250" y="250" text-anchor="middle" font-size="10" font-family="Helvetica">WE-102</text>
  <text x="250" y="265" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">65 qm</text>

  <!-- WE-103 -->
  <rect x="320" y="200" width="120" height="100" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="380" y="250" text-anchor="middle" font-size="10" font-family="Helvetica">WE-103</text>
  <text x="380" y="265" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">55 qm</text>

  <!-- WE-104 -->
  <rect x="60" y="320" width="120" height="100" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="120" y="370" text-anchor="middle" font-size="10" font-family="Helvetica">WE-104</text>
  <text x="120" y="385" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">45 qm</text>

  <!-- WE-105 -->
  <rect x="190" y="320" width="120" height="100" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="250" y="370" text-anchor="middle" font-size="10" font-family="Helvetica">WE-105</text>
  <text x="250" y="385" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">55 qm</text>

  <!-- WE-106 -->
  <rect x="320" y="320" width="120" height="100" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="380" y="370" text-anchor="middle" font-size="10" font-family="Helvetica">WE-106</text>
  <text x="380" y="385" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">75 qm</text>

  <!-- Axis labels -->
  <text x="60" y="460" font-size="9" font-family="Helvetica" fill="#999">Achsraster: A-F x 1-8, identisch zu EG</text>

  <!-- Title block -->
  <rect x="541" y="470" width="280" height="100" fill="white" stroke="#333" stroke-width="1.5"/>
  <line x1="541" y1="490" x2="821" y2="490" stroke="#333" stroke-width="0.5"/>
  <text x="551" y="485" font-size="9" font-family="Helvetica" font-weight="bold">Projekt: Sanierung Hochhaus am Stadtpark</text>
  <text x="551" y="505" font-size="9" font-family="Helvetica">Plan: Grundriss 1. Obergeschoss</text>
  <text x="551" y="520" font-size="9" font-family="Helvetica">Plan-Nr: A-OG1-001-v2</text>
  <text x="551" y="535" font-size="9" font-family="Helvetica">Massstab: 1:100 | Format: A1</text>
  <text x="551" y="550" font-size="9" font-family="Helvetica">Datum: 2024-01-15 | Version: 2</text>
  <text x="551" y="565" font-size="9" font-family="Helvetica">Ersteller: Hoffmann + Partner</text>
</svg>`;
}

function createLaengsschnittSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841 594" width="841" height="594">
  <!-- Background -->
  <rect width="841" height="594" fill="#f5f5f5" stroke="#333" stroke-width="2"/>

  <!-- Title bar -->
  <text x="420" y="35" text-anchor="middle" font-size="16" font-family="Helvetica" font-weight="bold">
    LAENGSSCHNITT A-A - Plan-Nr. A-LS-001
  </text>
  <text x="420" y="55" text-anchor="middle" font-size="11" font-family="Helvetica" fill="#666">
    Massstab 1:50 | Architekturbuero Hoffmann + Partner | Achse 4
  </text>

  <!-- Ground line -->
  <line x1="100" y1="380" x2="700" y2="380" stroke="#333" stroke-width="2"/>
  <text x="720" y="384" font-size="9" font-family="Helvetica">+/- 0,00 m</text>

  <!-- Tiefgarage -->
  <rect x="100" y="380" width="600" height="60" fill="#e0e0e0" stroke="#333" stroke-width="1.5"/>
  <text x="400" y="415" text-anchor="middle" font-size="10" font-family="Helvetica">Tiefgarage (UK -3,60 m / OK -0,30 m)</text>

  <!-- EG -->
  <rect x="100" y="320" width="600" height="60" fill="#e8f4e8" stroke="#333" stroke-width="1"/>
  <text x="400" y="355" text-anchor="middle" font-size="10" font-family="Helvetica">EG (lH 3,00 m)</text>

  <!-- OG 1-4 -->
  <rect x="100" y="200" width="600" height="120" fill="#fff" stroke="#333" stroke-width="1"/>
  <text x="400" y="265" text-anchor="middle" font-size="10" font-family="Helvetica">OG 1-4 (je 2,90 m GH, lH 2,55 m)</text>
  <line x1="100" y1="230" x2="700" y2="230" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>
  <line x1="100" y1="260" x2="700" y2="260" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>
  <line x1="100" y1="290" x2="700" y2="290" stroke="#ccc" stroke-width="0.5" stroke-dasharray="4,4"/>

  <!-- OG 5-12 -->
  <rect x="100" y="90" width="600" height="110" fill="#f5f5f5" stroke="#333" stroke-width="1"/>
  <text x="400" y="150" text-anchor="middle" font-size="10" font-family="Helvetica">OG 5-12 (je 2,90 m GH)</text>

  <!-- Dach -->
  <line x1="90" y1="85" x2="710" y2="85" stroke="#333" stroke-width="2"/>
  <text x="720" y="89" font-size="8" font-family="Helvetica">+38,10 m (OK Attika)</text>
  <text x="400" y="80" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">Flachdach 2% Gefaelle</text>

  <!-- Fundament -->
  <rect x="120" y="440" width="80" height="30" fill="#bbb" stroke="#333" stroke-width="1"/>
  <rect x="350" y="440" width="80" height="30" fill="#bbb" stroke="#333" stroke-width="1"/>
  <rect x="580" y="440" width="80" height="30" fill="#bbb" stroke="#333" stroke-width="1"/>
  <text x="400" y="490" text-anchor="middle" font-size="8" font-family="Helvetica" fill="#666">Streifenfundamente, UK -4,50 m</text>

  <!-- Dimension lines -->
  <text x="730" y="155" font-size="8" font-family="Helvetica" fill="#999">Gesamthoehe:</text>
  <text x="730" y="167" font-size="8" font-family="Helvetica" fill="#999">41,30 m</text>

  <!-- Deckenstaerken -->
  <text x="60" y="325" font-size="7" font-family="Helvetica" fill="#999">25 cm</text>
  <text x="60" y="385" font-size="7" font-family="Helvetica" fill="#999">30 cm</text>

  <!-- Title block -->
  <rect x="541" y="510" width="280" height="70" fill="white" stroke="#333" stroke-width="1.5"/>
  <line x1="541" y1="528" x2="821" y2="528" stroke="#333" stroke-width="0.5"/>
  <text x="551" y="524" font-size="9" font-family="Helvetica" font-weight="bold">Projekt: Sanierung Hochhaus am Stadtpark</text>
  <text x="551" y="542" font-size="9" font-family="Helvetica">Plan: Laengsschnitt A-A | Plan-Nr: A-LS-001</text>
  <text x="551" y="556" font-size="9" font-family="Helvetica">Massstab: 1:50 | Datum: 2024-01-20 | V1</text>
  <text x="551" y="570" font-size="9" font-family="Helvetica">Ersteller: Hoffmann + Partner</text>
</svg>`;
}

// --- Main ---

async function main() {
  console.log('Generating corpus files...\n');

  // PDFs
  const pdf1Path = path.join(DOCS_DIR, '01_vertraege/hauptvertrag_stadtpark_ag.pdf');
  const pdf2Path = path.join(DOCS_DIR, '01_vertraege/vertrag_rohbau_mueller_bau.pdf');

  await createContractPdf(HAUPTVERTRAG_TEXT, 'BAUVERTRAG (HAUPTVERTRAG)', pdf1Path);
  console.log(`  PDF: ${pdf1Path}`);

  await createContractPdf(VERTRAG_ROHBAU_TEXT, 'NACHUNTERNEHMERVERTRAG ROHBAUARBEITEN', pdf2Path);
  console.log(`  PDF: ${pdf2Path}`);

  // Excel
  const xlsxPath = path.join(DOCS_DIR, '08_rechnungen/re_mueller_bau_abschlag_01.xlsx');
  await createInvoiceExcel(xlsxPath);
  console.log(`  XLSX: ${xlsxPath}`);

  // SVGs
  const svgDir = path.join(DOCS_DIR, '05_plaene');

  const svg1Path = path.join(svgDir, 'grundrisse/grundriss_eg_v3.svg');
  await mkdir(path.dirname(svg1Path), { recursive: true });
  await writeFile(svg1Path, createGrundrissEgSvg(), 'utf-8');
  console.log(`  SVG: ${svg1Path}`);

  const svg2Path = path.join(svgDir, 'grundrisse/grundriss_og1_v2.svg');
  await writeFile(svg2Path, createGrundrissOg1Svg(), 'utf-8');
  console.log(`  SVG: ${svg2Path}`);

  const svg3Path = path.join(svgDir, 'schnitte/laengsschnitt_a_a.svg');
  await mkdir(path.dirname(svg3Path), { recursive: true });
  await writeFile(svg3Path, createLaengsschnittSvg(), 'utf-8');
  console.log(`  SVG: ${svg3Path}`);

  console.log('\nAll corpus files generated successfully.');
}

main().catch((err) => {
  console.error('Error generating corpus files:', err);
  process.exit(1);
});
