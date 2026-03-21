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
 * Phase 3 Plan 1: Contracts, change orders, and permits filled with content.
 * Remaining documents will be filled in subsequent plans.
 */
export const files: ProjectFilesystem = {
  // ── 01 Vertraege (Contracts) ──────────────────────────────────────
  '/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.txt': `BAUVERTRAG (HAUPTVERTRAG)
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
Stadtpark Immobilien AG            Hochbau Schmidt GmbH`,

  '/01_vertraege/auftraggeber/nachtrag_01_hauptvertrag.txt': `NACHTRAG NR. 1 ZUM HAUPTVERTRAG V-2024-001
Datum: 25.01.2024

Auftraggeber: Stadtpark Immobilien AG (Dr. Klaus Richter)
Auftragnehmer: Hochbau Schmidt GmbH (Thomas Schmidt)

Bezug: Hauptvertrag V-2024-001 vom 15.12.2023

1. Anlass
Bei der Bestandsaufnahme im Januar 2024 wurden zusaetzliche Schaeden an
der Tragstruktur in den Geschossen 3-5 festgestellt, die im urspruenglichen
Leistungsverzeichnis nicht erfasst waren.

2. Rechtsgrundlage
ss 2 Abs. 5 VOB/B (geaenderte Leistungen): Die zusaetzlichen Leistungen
waren bei Vertragsschluss nicht vorhersehbar und sind fuer die
ordnungsgemaesse Ausfuehrung erforderlich.

3. Leistungsumfang Nachtrag
- Zusaetzliche Betonarbeiten Geschoss 3-5 (Pos. N-01 bis N-08)
- Verstaerkung Stuetzen Achse C3-C7 (Pos. N-09 bis N-12)
- Ergaenzende Bewehrungsarbeiten (Pos. N-13 bis N-15)

4. Nachtragssumme
Gesamtsumme Nachtrag: 73.000,00 EUR netto
Neue Gesamtauftragssumme: 3.273.000,00 EUR netto

5. Terminliche Auswirkungen
Bauzeitverlaengerung: 2 Wochen fuer die zusaetzlichen Rohbauarbeiten.
Neuer Fertigstellungstermin: 14.10.2024

Berlin, den 25.01.2024

_________________________          _________________________
Dr. Klaus Richter                  Thomas Schmidt
Stadtpark Immobilien AG            Hochbau Schmidt GmbH`,

  '/01_vertraege/auftraggeber/buergschaftsurkunde_stadtpark_ag.txt': `VERTRAGSERFUELLUNGSBUERGSCHAFT
Buergschafts-Nr.: CB-2024-88741
Datum: 20.12.2023

Buergschaftsgeberin:
  Commerzbank AG, Filiale Berlin-Charlottenburg
  Bismarckstrasse 71, 10627 Berlin

Buergschaftsnehmerin:
  Stadtpark Immobilien AG
  Kurfuerstendamm 42, 10719 Berlin

Hauptschuldnerin:
  Hochbau Schmidt GmbH
  Berliner Strasse 17, 10715 Berlin

Bezug: Bauvertrag V-2024-001 vom 15.12.2023
Projekt: Sanierung Hochhaus am Stadtpark, Berlin-Charlottenburg

Buergschaftssumme: 160.000,00 EUR
(in Worten: einhundertsechzigtausend Euro)

Entspricht 5% der Auftragssumme von 3.200.000,00 EUR.

Die Commerzbank AG buergt hiermit selbstschuldnerisch unter Verzicht
auf die Einreden der Vorausklage (ss 771 BGB), der Anfechtbarkeit
und der Aufrechenbarkeit (ss 770 BGB) fuer die Erfuellung aller
Verpflichtungen der Hochbau Schmidt GmbH aus dem o.g. Bauvertrag.

Die Buergschaft ist befristet bis zur foermlichen Abnahme der
Bauleistungen, laengstens bis zum 31.12.2024.

Berlin, den 20.12.2023

_________________________
Commerzbank AG
Filiale Berlin-Charlottenburg`,

  '/01_vertraege/nachunternehmer/vertrag_rohbau_mueller_bau.txt': `NACHUNTERNEHMERVERTRAG ROHBAUARBEITEN
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
Hochbau Schmidt GmbH               Mueller Bau GmbH & Co. KG`,

  '/01_vertraege/nachunternehmer/vertrag_elektro_berger.txt': `NACHUNTERNEHMERVERTRAG ELEKTROINSTALLATION
Vertragsnummer: V-2024-003
Datum: 19.12.2023

Auftraggeber (GU):
  Hochbau Schmidt GmbH (Thomas Schmidt, Geschaeftsfuehrer)
  Berliner Strasse 17, 10715 Berlin

Auftragnehmer (NU):
  Elektro Berger OHG (Frank Berger, Meister/Inhaber)
  Siemensstrasse 12, 10551 Berlin

Bezug: Hauptvertrag V-2024-001 (Stadtpark Immobilien AG / Hochbau Schmidt)
Projekt: Sanierung Hochhaus am Stadtpark, Berlin-Charlottenburg

1. Leistungsumfang
Komplette Elektroinstallation gemaess LV Positionen 04.01 bis 04.35:
- Starkstrominstallation 400V/230V (DIN 18382)
- Schwachstromverkabelung (EDV, Telefon, SAT)
- Brandmeldeanlage (BMA) gemaess DIN 14675
- Sicherheitsbeleuchtung und Fluchtwegebeleuchtung
- Aufzugsanbindung elektrisch

2. Auftragssumme
Pauschalpreis: 420.000,00 EUR netto
Abschlagszahlungen: monatlich nach Leistungsstand

3. Vertragsgrundlagen
VOB/B 2016, VOB/C 2019, DIN 18382, VDE-Vorschriften.
Planunterlagen Architekturbuero Hoffmann + Partner.

4. Termine
Beginn: 15.01.2024 (nach Rohbau-Vorlauf)
Fertigstellung: 31.07.2024

5. Gewaehrleistung
5 Jahre ab Abnahme gem. ss 13 VOB/B.

Berlin, den 19.12.2023

_________________________          _________________________
Thomas Schmidt                     Frank Berger
Hochbau Schmidt GmbH               Elektro Berger OHG`,

  '/01_vertraege/nachunternehmer/vertrag_sanitaer_weber.txt': `NACHUNTERNEHMERVERTRAG SANITAER/HEIZUNG/LUEFTUNG
Vertragsnummer: V-2024-004
Datum: 19.12.2023

Auftraggeber (GU):
  Hochbau Schmidt GmbH (Thomas Schmidt, Geschaeftsfuehrer)
  Berliner Strasse 17, 10715 Berlin

Auftragnehmer (NU):
  Sanitaer Weber GmbH (Peter Weber, Meister/Geschaeftsfuehrer)
  Havelstrasse 8, 10559 Berlin

Bezug: Hauptvertrag V-2024-001 (Stadtpark Immobilien AG / Hochbau Schmidt)
Projekt: Sanierung Hochhaus am Stadtpark, Berlin-Charlottenburg

1. Leistungsumfang
Komplette Sanitaer-, Heizungs- und Lueftungsinstallation
gemaess LV Positionen 03.01 bis 03.42:
- Sanitaerinstallation (DIN 18381): Trink- und Abwasserleitungen,
  Sanitaerobjekte in 48 Wohneinheiten
- Heizungsinstallation (DIN 18380): Erneuerung Heizungsverteilung,
  Heizkoerper, Thermostatventile
- Lueftungsanlage: Zentrale Abluftanlage Kuechen und Baeder

2. Auftragssumme
Einheitspreisvertrag: 380.000,00 EUR netto
Abschlagszahlungen: monatlich nach Aufmass

3. Vertragsgrundlagen
VOB/B 2016, VOB/C 2019, DIN 18380, DIN 18381,
DVGW-Regelwerk, EnEV 2020.
Planunterlagen Architekturbuero Hoffmann + Partner.

4. Termine
Beginn: 15.01.2024 (nach Rohbau-Vorlauf)
Fertigstellung: 31.07.2024

5. Gewaehrleistung
5 Jahre ab Abnahme gem. ss 13 VOB/B.

Berlin, den 19.12.2023

_________________________          _________________________
Thomas Schmidt                     Peter Weber
Hochbau Schmidt GmbH               Sanitaer Weber GmbH`,

  '/01_vertraege/nachunternehmer/vertrag_fassade_kern.txt': `NACHUNTERNEHMERVERTRAG FASSADENSANIERUNG
Vertragsnummer: V-2024-005
Datum: 20.12.2023

Auftraggeber (GU):
  Hochbau Schmidt GmbH (Thomas Schmidt, Geschaeftsfuehrer)
  Berliner Strasse 17, 10715 Berlin

Auftragnehmer (NU):
  Fassaden Kern AG (Michael Kern, Projektleiter)
  Potsdamer Strasse 95, 10785 Berlin

Bezug: Hauptvertrag V-2024-001 (Stadtpark Immobilien AG / Hochbau Schmidt)
Projekt: Sanierung Hochhaus am Stadtpark, Berlin-Charlottenburg

1. Leistungsumfang
Komplette Fassadensanierung gemaess LV Positionen 02.01 bis 02.38:
- Demontage bestehende Fassadenelemente
- Waermedaemmverbundsystem WDVS (DIN 18345)
  Daemmstaerke 160mm, WLG 035
- Fensteraustausch saemtlicher 192 Fensterelemente (DIN 18351)
  3-fach Verglasung, Uw <= 0,95 W/m2K
- Fassadenbekleidung und Anstrich
- Erfuellung EnEV-Anforderungen Bestandsgebaeude

2. Auftragssumme
Pauschalpreis: 520.000,00 EUR netto
Abschlagszahlungen: monatlich nach Leistungsstand

3. Vertragsgrundlagen
VOB/B 2016, VOB/C 2019, DIN 18345, DIN 18351, EnEV 2020.
Planunterlagen Architekturbuero Hoffmann + Partner.

4. Termine
Beginn: 01.03.2024 (nach Abschluss Rohbau Fassadenebene)
Fertigstellung: 31.08.2024

5. Gewaehrleistung
5 Jahre ab Abnahme gem. ss 13 VOB/B.

Berlin, den 20.12.2023

_________________________          _________________________
Thomas Schmidt                     Michael Kern
Hochbau Schmidt GmbH               Fassaden Kern AG`,

  // ── 02 Nachtraege (Change Orders) ────────────────────────────────
  '/02_nachtraege/genehmigt/nachtrag_001_tiefgarage_abdichtung.txt': `NACHTRAGSANGEBOT NR. NT-001
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 05.02.2024
Status: GENEHMIGT (12.02.2024)

Auftragnehmer: Mueller Bau GmbH & Co. KG (Hans Mueller)
Bezugsvertrag: V-2024-002 (Rohbauarbeiten)
Hauptvertrag: V-2024-001

1. Bezeichnung
Zusaetzliche Abdichtungsarbeiten Tiefgarage

2. Anlass
Bei den Abbrucharbeiten in der Tiefgarage wurden am 28.01.2024
grossflaechige Durchfeuchtungen und Betonschaeden an der Bodenplatte
festgestellt (siehe auch Mangel M-001). Der Zustand war aus den
Bestandsunterlagen nicht ersichtlich.

3. Rechtsgrundlage
ss 2 Abs. 5 VOB/B — geaenderte/zusaetzliche Leistungen aufgrund
unvorhersehbarer Baugrundverhaeltnisse.

4. Leistungsumfang
- Freilegen und Reinigen Bodenplatte Tiefgarage (ca. 340 m2)
- Rissinjektionen mit PU-Harz
- Aufbringen zweilagige Bitumendickbeschichtung
- Schutzschicht und Drainagematte
- Wiederherstellung Bodenaufbau

5. Nachtragssumme
Gesamtsumme: 45.000,00 EUR netto

Genehmigt durch Bauleitung Hochbau Schmidt GmbH am 12.02.2024.
Freigabe AG (Stadtpark Immobilien AG) am 14.02.2024.

_________________________
Thomas Schmidt, Bauleiter
Hochbau Schmidt GmbH`,

  '/02_nachtraege/genehmigt/nachtrag_002_fassade_daemmung.txt': `NACHTRAGSANGEBOT NR. NT-002
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 10.02.2024
Status: GENEHMIGT (18.02.2024)

Auftragnehmer: Fassaden Kern AG (Michael Kern)
Bezugsvertrag: V-2024-005 (Fassadensanierung)
Hauptvertrag: V-2024-001

1. Bezeichnung
Erhoehte Daemmstaerke Fassade gemaess aktualisierter EnEV-Anforderungen

2. Anlass
Die am 01.02.2024 in Kraft getretene Aenderung der Energieeinsparverordnung
erfordert fuer Bestandssanierungen im Bereich der thermischen Huelle eine
Erhoehung der Mindestdaemmstaerke. Die im Vertrag V-2024-005 vereinbarte
Daemmstaerke von 160mm (WLG 035) ist nicht mehr ausreichend.

3. Rechtsgrundlage
ss 2 Abs. 5 VOB/B — geaenderte Leistungen aufgrund geaenderter
Rechtsvorschriften waehrend der Bauausfuehrung.

4. Leistungsumfang
- Erhoehung Daemmstaerke von 160mm auf 200mm (WLG 032)
- Anpassung Fensterlaibungen und Anschluesse
- Aenderung Befestigungssystem (laengere Duebel)
- Anpassung Detailplanung Fassadenanschluesse

5. Nachtragssumme
Gesamtsumme: 28.000,00 EUR netto

Genehmigt durch Bauleitung Hochbau Schmidt GmbH am 18.02.2024.
Freigabe AG (Stadtpark Immobilien AG) am 20.02.2024.

_________________________
Thomas Schmidt, Bauleiter
Hochbau Schmidt GmbH`,

  '/02_nachtraege/offen/nachtrag_003_elektro_zusatzleistung.txt': `NACHTRAGSANGEBOT NR. NT-003
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 20.02.2024
Status: OFFEN (strittig)

Auftragnehmer: Elektro Berger OHG (Frank Berger)
Bezugsvertrag: V-2024-003 (Elektroinstallation)
Hauptvertrag: V-2024-001

1. Bezeichnung
Zusaetzliche Steckdosen und Datenanschluesse je Wohneinheit

2. Anlass
Auf Wunsch der Stadtpark Immobilien AG sollen je Wohneinheit
zusaetzlich 2 Doppelsteckdosen und 1 Datenanschluss (CAT 7)
installiert werden. Die Anforderung wurde am 15.02.2024
in der Baubesprechung Nr. 003 muendlich mitgeteilt.

3. Rechtsgrundlage
ss 2 Abs. 6 VOB/B — zusaetzliche Leistungen, die nicht im
urspruenglichen Leistungsverzeichnis enthalten sind.

4. Leistungsumfang
- 96 Doppelsteckdosen zusaetzlich (48 WE x 2)
- 48 CAT-7 Datenanschluesse zusaetzlich (48 WE x 1)
- Schlitzarbeiten, Leitungsfuehrung, Unterputzdosen
- Erweiterung Unterverteilungen je Geschoss

5. Nachtragssumme
Gesamtsumme: 12.500,00 EUR netto

HINWEIS: Hochbau Schmidt GmbH ist der Auffassung, dass die
zusaetzlichen Steckdosen bereits im Leistungsumfang des Vertrags
V-2024-003 enthalten sind (Pos. 04.12 "Steckdosenausstattung
nach aktuellem Standard"). Eine Pruefung ist noch ausstehend.

_________________________
Frank Berger, Meister
Elektro Berger OHG`,

  '/02_nachtraege/offen/nachtrag_004_sanitaer_heizkoerper.txt': `NACHTRAGSANGEBOT NR. NT-004
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 25.02.2024
Status: OFFEN (in Pruefung)

Auftragnehmer: Sanitaer Weber GmbH (Peter Weber)
Bezugsvertrag: V-2024-004 (Sanitaer/Heizung/Lueftung)
Hauptvertrag: V-2024-001

1. Bezeichnung
Upgrade Heizkoerper auf energieeffiziente Niedertemperatur-Ausfuehrung

2. Anlass
Im Rahmen der aktualisierten EnEV-Anforderungen und auf Empfehlung
des Energieberaters sollen die im Vertrag V-2024-004 vorgesehenen
Standard-Heizkoerper durch Niedertemperatur-Flachheizkoerper
(Typ 22, erhoehte Heizflaeche) ersetzt werden.

3. Rechtsgrundlage
ss 2 Abs. 5 VOB/B — geaenderte Leistungen aufgrund geaenderter
technischer Anforderungen.

4. Leistungsumfang
- Austausch Heizkoerpertyp in 48 Wohneinheiten
  (Standard Typ 11 -> Niedertemperatur Typ 22)
- Anpassung Heizungsanbindeleitungen (groessere Dimension)
- Hydraulischer Abgleich nach Umbau
- Anpassung Regelungstechnik

5. Nachtragssumme
Gesamtsumme: 8.200,00 EUR netto

Anmerkung: Pruefung durch Bauleitung laeuft seit 01.03.2024.
Energieberater bestaetigt Wirtschaftlichkeit der Massnahme.

_________________________
Peter Weber, Meister
Sanitaer Weber GmbH`,

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
  '/09_genehmigungen/baugenehmigung_2023-06-01.txt': `BAUGENEHMIGUNG
Bauaufsichtsamt Berlin-Charlottenburg
Aktenzeichen: BA-2023-4471
Datum: 01.06.2023

Bauherr:
  Stadtpark Immobilien AG
  Kurfuerstendamm 42, 10719 Berlin

Bauvorhaben:
  Sanierung Hochhaus am Stadtpark
  Stadtparkstrasse 15, 10623 Berlin-Charlottenburg

Auf der Grundlage der Bauordnung Berlin (BauO Bln) und des am
12.04.2023 eingereichten Bauantrags wird hiermit die Baugenehmigung
fuer folgendes Vorhaben erteilt:

Genehmigter Umfang:
- Kernsanierung eines 12-geschossigen Wohnhochhauses (Baujahr 1972)
- Fassadensanierung inkl. WDVS und Fensteraustausch
- Erneuerung Haustechnik (Elektro, Sanitaer, Heizung, Lueftung)
- Sanierung Tiefgarage (30 Stellplaetze)
- Keine Nutzungsaenderung (Wohnnutzung bleibt bestehen)

Auflagen:
1. Einhaltung des genehmigten Brandschutzkonzepts (siehe Freigabe vom 10.09.2023)
2. Statischer Nachweis fuer alle tragwerksrelevanten Eingriffe erforderlich
3. Baubeginnsanzeige mindestens 1 Woche vor Baubeginn
4. Einhaltung der Immissionsschutzauflagen (Laermschutz, Staubschutz)

Diese Genehmigung erlischt, wenn nicht innerhalb von 3 Jahren
nach Zustellung mit dem Bau begonnen wird.

Rechtsbehelfsbelehrung:
Gegen diesen Bescheid kann innerhalb eines Monats Widerspruch erhoben werden.

_________________________
Dipl.-Ing. Petra Koenig
Leiterin Bauaufsichtsamt
Berlin-Charlottenburg`,

  '/09_genehmigungen/statik_pruefbericht_2023-08-15.txt': `PRUEFBERICHT STANDSICHERHEIT
Pruefbericht-Nr.: PSN-2023-0847
Datum: 15.08.2023

Pruefer:
  Dr.-Ing. Rainer Stahlmann
  Oeffentlich bestellter und vereidigter Pruefingenieur
  fuer Standsicherheit (Pruefingenieur nach BauO Bln)

Bauvorhaben:
  Sanierung Hochhaus am Stadtpark
  Stadtparkstrasse 15, 10623 Berlin-Charlottenburg
  Aktenzeichen: BA-2023-4471

Auftraggeber: Stadtpark Immobilien AG

Gegenstand der Pruefung:
Statische Berechnung und Konstruktionszeichnungen fuer die geplante
Kernsanierung, erstellt durch Architekturbuero Hoffmann + Partner
(Statik-Abteilung), Planstand Juli 2023.

Pruefungsergebnis:
Die Standsicherheit des Gebaeudes ist fuer die geplanten Umbaumassnahmen
gewaehrleistet, sofern folgende Bedingungen eingehalten werden:

1. Stuetzen Achse B2 bis B8 (EG bis 3.OG) duerfen nur bei gleichzeitiger
   Abstuetzung der Decken freigelegt werden.
2. Die Tragfaehigkeit der Bodenplatte Tiefgarage ist fuer die geplante
   Nutzlast von 3,5 kN/m2 ausreichend.
3. Fassadenverankerungen muessen gemaess Detail F-01 ausgefuehrt werden.
4. Vor Beginn der Rohbauarbeiten ist ein Beweissicherungsgutachten
   fuer die angrenzende Bebauung zu erstellen.

Gesamturteil: STANDSICHERHEIT NACHGEWIESEN

_________________________
Dr.-Ing. Rainer Stahlmann
Pruefingenieur fuer Standsicherheit`,

  '/09_genehmigungen/brandschutzkonzept_freigabe_2023-09-10.txt': `FREIGABE BRANDSCHUTZKONZEPT
Aktenzeichen: BS-2023-4471/01
Datum: 10.09.2023

Erstellt durch:
  Brandschutzbuero Hartmann GmbH
  Dipl.-Ing. Sabine Hartmann, Brandschutzplanerin

Geprueft und freigegeben durch:
  Berliner Feuerwehr, Abteilung Vorbeugender Brandschutz

Bauvorhaben:
  Sanierung Hochhaus am Stadtpark
  Stadtparkstrasse 15, 10623 Berlin-Charlottenburg
  Bezug: Baugenehmigung BA-2023-4471 vom 01.06.2023

Gebaeudeklassifizierung:
- Gebaeudehoehe: 36,50 m (Hochhaus gemaess ss 2 Abs. 4 BauO Bln)
- Brandschutzklasse: Gebaeudesonderklasse 5
- Nutzung: Wohngebaeude, 48 Wohneinheiten, 12 Geschosse

Brandschutzanforderungen:
1. Zwei bauliche Rettungswege je Geschoss (Treppenraum + Sicherheitstreppenraum)
2. Brandmeldeanlage (BMA) Kategorie 2 gemaess DIN 14675
   - Automatische Brandmelder in allen Fluren und Technikraeumen
   - Handfeuermelder an allen Treppenraumzugaengen
   - Aufschaltung auf Berliner Feuerwehr
3. Feuerwehraufzug gemaess DIN EN 81-72
4. Rauch- und Waermeabzugsanlage (RWA) im Treppenraum
5. Brandschutzklappen in allen Installationsschaechten
6. Feuerwiderstandsklasse Tragwerk: R 90 (EG-3.OG), R 60 (4.OG-11.OG)

Auflagen:
- Brandschutzbegehung vor Inbetriebnahme durch Berliner Feuerwehr
- Abnahme BMA durch akkreditierte Pruefstelle

Status: FREIGEGEBEN

_________________________
Dipl.-Ing. Sabine Hartmann         Brandoberamtsrat K. Fischer
Brandschutzbuero Hartmann          Berliner Feuerwehr`,
};
