/**
 * Evaluation test questions with ground-truth expectations.
 * 18 questions covering all 9 document categories plus cross-cutting queries.
 * Ground truth is derived from actual corpus content in filesystem.ts.
 */

import type { EvalQuestion } from '@/eval/types';

export const questions: EvalQuestion[] = [
  // ── vertraege (2) ──────────────────────────────────────────────────
  {
    id: 'Q-01',
    text: 'Wie hoch ist die Auftragssumme des Hauptvertrags und wer sind die Vertragsparteien?',
    category: 'vertraege',
    expectedKeywords: [
      '3.200.000',
      'Stadtpark Immobilien AG',
      'Hochbau Schmidt GmbH',
      'V-2024-001',
    ],
    expectedSourcePaths: [
      '/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.pdf',
    ],
    maxSteps: 6,
  },
  {
    id: 'Q-02',
    text: 'Welcher Nachunternehmer ist fuer die Rohbauarbeiten beauftragt und wie hoch ist seine Auftragssumme?',
    category: 'vertraege',
    expectedKeywords: [
      'Mueller Bau',
      '890.000',
      'V-2024-002',
      'Rohbauarbeiten',
    ],
    expectedSourcePaths: [
      '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.pdf',
    ],
    maxSteps: 6,
  },

  // ── nachtraege (2) ─────────────────────────────────────────────────
  {
    id: 'Q-03',
    text: 'Welche Nachtraege wurden bereits genehmigt und wie hoch sind die jeweiligen Summen?',
    category: 'nachtraege',
    expectedKeywords: [
      'NT-001',
      '45.000',
      'NT-002',
      '28.000',
      'genehmigt',
    ],
    expectedSourcePaths: [
      '/02_nachtraege/genehmigt/nachtrag_001_tiefgarage_abdichtung.txt',
      '/02_nachtraege/genehmigt/nachtrag_002_fassade_daemmung.txt',
    ],
    maxSteps: 8,
  },
  {
    id: 'Q-04',
    text: 'Was ist der aktuelle Status des Nachtrags NT-003 und worum geht es dabei?',
    category: 'nachtraege',
    expectedKeywords: [
      'NT-003',
      'strittig',
      'Elektro Berger',
      'Steckdosen',
      '12.500',
    ],
    expectedSourcePaths: [
      '/02_nachtraege/offen/nachtrag_003_elektro_zusatzleistung.txt',
    ],
    maxSteps: 6,
  },

  // ── protokolle (2) ─────────────────────────────────────────────────
  {
    id: 'Q-05',
    text: 'Wer hat an der ersten Baubesprechung am 15.01.2024 teilgenommen?',
    category: 'protokolle',
    expectedKeywords: [
      'Thomas Schmidt',
      'Hans Mueller',
      'Frank Berger',
      'Peter Weber',
      'Maria Hoffmann',
    ],
    expectedSourcePaths: [
      '/03_protokolle/baustellenbesprechung/2024-01-15_baubesprechung_nr001.txt',
    ],
    maxSteps: 6,
  },
  {
    id: 'Q-06',
    text: 'Welche Entscheidungen wurden in der Planungsbesprechung vom 07.02.2024 getroffen?',
    category: 'protokolle',
    expectedKeywords: [
      'Daemmstaerke',
      '200 mm',
      'Fassadendetails',
      'NT-002',
    ],
    expectedSourcePaths: [
      '/03_protokolle/planungsbesprechung/2024-02-07_planungsbesprechung_nr002.txt',
    ],
    maxSteps: 6,
  },

  // ── maengel (2) ────────────────────────────────────────────────────
  {
    id: 'Q-07',
    text: 'Welche Maengel sind aktuell noch offen und wo befinden sie sich?',
    category: 'maengel',
    expectedKeywords: [
      'M-001',
      'Tiefgarage',
      'M-002',
      'Fenster',
      'M-003',
      'Estrich',
    ],
    expectedSourcePaths: [
      '/04_maengel/offen/mangel_001_riss_tiefgarage.txt',
      '/04_maengel/offen/mangel_002_fenster_undicht_og3.txt',
      '/04_maengel/offen/mangel_003_estrich_hoehe_eg.txt',
    ],
    maxSteps: 8,
  },
  {
    id: 'Q-08',
    text: 'Was war der Mangel M-004 und wie wurde er behoben?',
    category: 'maengel',
    expectedKeywords: [
      'M-004',
      'Sicherungskasten',
      'Elektro Berger',
      'behoben',
      '25.01.2024',
    ],
    expectedSourcePaths: [
      '/04_maengel/behoben/mangel_004_elektro_sicherungskasten.txt',
    ],
    maxSteps: 6,
  },

  // ── plaene (2) ─────────────────────────────────────────────────────
  {
    id: 'Q-09',
    text: 'Welche Version hat der Grundriss Erdgeschoss aktuell und was wurde in den Versionen geaendert?',
    category: 'plaene',
    expectedKeywords: [
      'Version 3',
      'A-EG-001-v3',
      'Estrichhoehen-Korrektur',
      'M-003',
    ],
    expectedSourcePaths: [
      '/05_plaene/grundrisse/grundriss_eg_v3.txt',
    ],
    maxSteps: 6,
  },
  {
    id: 'Q-10',
    text: 'Welche Planmetadaten sind fuer den Laengsschnitt A-A hinterlegt?',
    category: 'plaene',
    expectedKeywords: [
      'A-LS-001',
      '1:50',
      'Hoffmann',
      'Tiefgarage',
    ],
    expectedSourcePaths: [
      '/05_plaene/schnitte/laengsschnitt_a_a.txt',
    ],
    maxSteps: 6,
  },

  // ── schriftverkehr (1) ─────────────────────────────────────────────
  {
    id: 'Q-11',
    text: 'Was steht in der Behinderungsanzeige von Mueller Bau und welche Gruende werden genannt?',
    category: 'schriftverkehr',
    expectedKeywords: [
      'Behinderungsanzeige',
      'Planlieferung',
      'Bodenverhaeltnisse',
      '3 Wochen',
      'ss 6',
    ],
    expectedSourcePaths: [
      '/06_schriftverkehr/eingehend/2024-02-15_mueller_bau_behinderungsanzeige.txt',
    ],
    maxSteps: 6,
  },

  // ── bautagebuch (1) ────────────────────────────────────────────────
  {
    id: 'Q-12',
    text: 'Wie war das Wetter am 15.01.2024 und wie viele Arbeitskraefte waren auf der Baustelle?',
    category: 'bautagebuch',
    expectedKeywords: [
      'bewoelkt',
      '3°C',
      '10 Arbeitskraefte',
      'Mueller Bau',
      '8 Mann',
    ],
    expectedSourcePaths: [
      '/07_bautagebuch/2024-01-15_bautagebuch.txt',
    ],
    maxSteps: 6,
  },

  // ── rechnungen (2) ─────────────────────────────────────────────────
  {
    id: 'Q-13',
    text: 'Wie hoch ist die erste Abschlagsrechnung von Mueller Bau und wurde sie geprueft?',
    category: 'rechnungen',
    expectedKeywords: [
      'RE-2024-001',
      '267.000',
      'Mueller Bau',
      'geprueft',
    ],
    expectedSourcePaths: [
      '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.xlsx',
    ],
    maxSteps: 6,
  },
  {
    id: 'Q-14',
    text: 'Welche Rechnungen sind aktuell noch offen und warum?',
    category: 'rechnungen',
    expectedKeywords: [
      'Fassaden Kern',
      'RE-2024-004',
      'Mueller Bau',
      'RE-2024-005',
      'offen',
    ],
    expectedSourcePaths: [
      '/08_rechnungen/offen/re_fassaden_kern_abschlag_01.txt',
      '/08_rechnungen/offen/re_mueller_bau_abschlag_02.txt',
    ],
    maxSteps: 8,
  },

  // ── genehmigungen (1) ──────────────────────────────────────────────
  {
    id: 'Q-15',
    text: 'Wann wurde die Baugenehmigung erteilt und welche Auflagen enthaelt sie?',
    category: 'genehmigungen',
    expectedKeywords: [
      'BA-2023-4471',
      '01.06.2023',
      'Brandschutzkonzept',
      'Baubeginnsanzeige',
    ],
    expectedSourcePaths: [
      '/09_genehmigungen/baugenehmigung_2023-06-01.txt',
    ],
    maxSteps: 6,
  },

  // ── cross-cutting (3) ──────────────────────────────────────────────
  {
    id: 'Q-16',
    text: 'In welchen Dokumenten wird Mueller Bau erwaehnt und welche Rolle spielt die Firma im Projekt?',
    category: 'cross-cutting',
    expectedKeywords: [
      'Mueller Bau',
      'Rohbau',
      'V-2024-002',
      '890.000',
      'Behinderungsanzeige',
    ],
    expectedSourcePaths: [
      '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.pdf',
      '/06_schriftverkehr/eingehend/2024-02-15_mueller_bau_behinderungsanzeige.txt',
      '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.xlsx',
    ],
    maxSteps: 10,
  },
  {
    id: 'Q-17',
    text: 'Welche Informationen gibt es zum Mangel M-001 und in welchen anderen Dokumenten wird dieser Mangel referenziert?',
    category: 'cross-cutting',
    expectedKeywords: [
      'M-001',
      'Tiefgarage',
      'Riss',
      'Mueller Bau',
      'NT-001',
    ],
    expectedSourcePaths: [
      '/04_maengel/offen/mangel_001_riss_tiefgarage.txt',
      '/06_schriftverkehr/eingehend/2024-02-15_mueller_bau_behinderungsanzeige.txt',
    ],
    maxSteps: 10,
  },
  {
    id: 'Q-18',
    text: 'Wie ist der Gesamtueberblick ueber alle Nachunternehmervertraege — welche Firmen, Gewerke und Summen?',
    category: 'cross-cutting',
    expectedKeywords: [
      'Mueller Bau',
      'Elektro Berger',
      'Sanitaer Weber',
      'Fassaden Kern',
      '890.000',
      '420.000',
    ],
    expectedSourcePaths: [
      '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.pdf',
      '/01_vertraege/nachunternehmer/vertrag_elektro_berger.txt',
      '/01_vertraege/nachunternehmer/vertrag_sanitaer_weber.txt',
    ],
    maxSteps: 10,
  },
  // ── math/logic (3) ──────────────────────────────────────────────────
  {
    id: 'Q-19',
    text: 'Wie hoch ist die Gesamtsumme aller genehmigten Nachtraege in Euro?',
    category: 'nachtraege',
    expectedKeywords: [
      '73.000',
      '45.000',
      '28.000',
    ],
    expectedSourcePaths: [
      '/02_nachtraege/genehmigt/nachtrag_001_tiefgarage_abdichtung.txt',
      '/02_nachtraege/genehmigt/nachtrag_002_fassade_daemmung.txt',
    ],
    maxSteps: 8,
  },
  {
    id: 'Q-20',
    text: 'Wie viele Maengel sind noch offen und wie viele wurden bereits behoben? Nenne die Anzahl jeweils.',
    category: 'maengel',
    expectedKeywords: [
      'offen',
      'behoben',
    ],
    expectedSourcePaths: [
      '/04_maengel/offen/mangel_001_riss_tiefgarage.txt',
    ],
    maxSteps: 6,
  },
  {
    id: 'Q-21',
    text: 'Welcher Nachtrag hat die hoechste Summe und um wie viel Euro uebersteigt er den zweithoechsten Nachtrag?',
    category: 'cross-cutting',
    expectedKeywords: [
      'NT-001',
      '45.000',
      '17.000',
    ],
    expectedSourcePaths: [
      '/02_nachtraege/genehmigt/nachtrag_001_tiefgarage_abdichtung.txt',
      '/02_nachtraege/genehmigt/nachtrag_002_fassade_daemmung.txt',
    ],
    maxSteps: 8,
  },
];
