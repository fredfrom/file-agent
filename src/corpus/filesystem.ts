import type { ProjectFilesystem } from './types';

/**
 * Virtual filesystem for "Sanierung Hochhaus am Stadtpark".
 *
 * Parties:
 *   Bauherr: Stadtpark Immobilien AG
 *   Generalunternehmer: Hochbau Schmidt GmbH
 *   Subcontractors: Mueller Bau (Rohbau), Elektro Berger, Sanitaer Weber, Fassaden Kern
 *   Architekt: Architekturbuero Hoffmann + Partner
 *
 * All values are empty strings — content will be added in Phase 3.
 */
export const files: ProjectFilesystem = {
  // ── 01 Vertraege (Contracts) ──────────────────────────────────────
  '/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.txt': '',
  '/01_vertraege/auftraggeber/nachtrag_01_hauptvertrag.txt': '',
  '/01_vertraege/auftraggeber/buergschaftsurkunde_stadtpark_ag.txt': '',
  '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.txt': '',
  '/01_vertraege/nachunternehmer/vertrag_elektro_berger.txt': '',
  '/01_vertraege/nachunternehmer/vertrag_sanitaer_weber.txt': '',
  '/01_vertraege/nachunternehmer/vertrag_fassade_kern.txt': '',

  // ── 02 Nachtraege (Change Orders) ────────────────────────────────
  '/02_nachtraege/genehmigt/nachtrag_001_tiefgarage_abdichtung.txt': '',
  '/02_nachtraege/genehmigt/nachtrag_002_fassade_daemmung.txt': '',
  '/02_nachtraege/offen/nachtrag_003_elektro_zusatzleistung.txt': '',
  '/02_nachtraege/offen/nachtrag_004_sanitaer_heizkoerper.txt': '',

  // ── 03 Protokolle (Meeting Minutes) ──────────────────────────────
  '/03_protokolle/baustellenbesprechung/2024-01-15_baubesprechung_nr001.txt': '',
  '/03_protokolle/baustellenbesprechung/2024-01-29_baubesprechung_nr002.txt': '',
  '/03_protokolle/baustellenbesprechung/2024-02-12_baubesprechung_nr003.txt': '',
  '/03_protokolle/planungsbesprechung/2024-01-10_planungsbesprechung_nr001.txt': '',
  '/03_protokolle/planungsbesprechung/2024-02-07_planungsbesprechung_nr002.txt': '',

  // ── 04 Maengel (Defects / Punch Lists) ───────────────────────────
  '/04_maengel/offen/mangel_001_riss_tiefgarage.txt': '',
  '/04_maengel/offen/mangel_002_fenster_undicht_og3.txt': '',
  '/04_maengel/offen/mangel_003_estrich_hoehe_eg.txt': '',
  '/04_maengel/behoben/mangel_004_elektro_sicherungskasten.txt': '',
  '/04_maengel/behoben/mangel_005_sanitaer_rohrbruch_ug.txt': '',

  // ── 05 Plaene (Plans / Drawings) ─────────────────────────────────
  '/05_plaene/grundrisse/grundriss_eg_v3.txt': '',
  '/05_plaene/grundrisse/grundriss_og1_v2.txt': '',
  '/05_plaene/grundrisse/grundriss_og2_v2.txt': '',
  '/05_plaene/schnitte/laengsschnitt_a_a.txt': '',
  '/05_plaene/schnitte/querschnitt_b_b.txt': '',
  '/05_plaene/details/detail_fassadenanschluss.txt': '',
  '/05_plaene/details/detail_tiefgarage_abdichtung.txt': '',

  // ── 06 Schriftverkehr (Correspondence) ───────────────────────────
  '/06_schriftverkehr/eingehend/2024-01-20_stadtpark_ag_freigabe_rohbau.txt': '',
  '/06_schriftverkehr/eingehend/2024-02-05_archbuero_hoffmann_planlieferung.txt': '',
  '/06_schriftverkehr/eingehend/2024-02-15_mueller_bau_behinderungsanzeige.txt': '',
  '/06_schriftverkehr/ausgehend/2024-01-18_schmidt_an_stadtpark_ag_terminplan.txt': '',
  '/06_schriftverkehr/ausgehend/2024-02-01_schmidt_an_mueller_bau_maengelruege.txt': '',
  '/06_schriftverkehr/ausgehend/2024-02-10_schmidt_an_elektro_berger_nachforderung.txt': '',

  // ── 07 Bautagebuch (Daily Construction Logs) ─────────────────────
  '/07_bautagebuch/2024-01-15_bautagebuch.txt': '',
  '/07_bautagebuch/2024-01-16_bautagebuch.txt': '',
  '/07_bautagebuch/2024-01-17_bautagebuch.txt': '',
  '/07_bautagebuch/2024-02-01_bautagebuch.txt': '',
  '/07_bautagebuch/2024-02-02_bautagebuch.txt': '',

  // ── 08 Rechnungen (Invoices) ─────────────────────────────────────
  '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.txt': '',
  '/08_rechnungen/geprueft/re_elektro_berger_abschlag_01.txt': '',
  '/08_rechnungen/geprueft/re_sanitaer_weber_abschlag_01.txt': '',
  '/08_rechnungen/offen/re_fassaden_kern_abschlag_01.txt': '',
  '/08_rechnungen/offen/re_mueller_bau_abschlag_02.txt': '',

  // ── 09 Genehmigungen (Permits / Approvals) ──────────────────────
  '/09_genehmigungen/baugenehmigung_2023-06-01.txt': '',
  '/09_genehmigungen/statik_pruefbericht_2023-08-15.txt': '',
  '/09_genehmigungen/brandschutzkonzept_freigabe_2023-09-10.txt': '',
};
