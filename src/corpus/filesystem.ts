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
  '/03_protokolle/baustellenbesprechung/2024-01-15_baubesprechung_nr001.txt': `PROTOKOLL BAUBESPRECHUNG NR. 001
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 15.01.2024, 10:00 Uhr
Ort: Baucontainer Stadtpark, Stadtparkstrasse 15, Berlin-Charlottenburg

Teilnehmer:
- Thomas Schmidt (Hochbau Schmidt GmbH, Bauleitung)
- Hans Mueller (Mueller Bau GmbH & Co. KG, Rohbau)
- Frank Berger (Elektro Berger OHG, Elektro)
- Peter Weber (Sanitaer Weber GmbH, Sanitaer/Heizung)
- Maria Hoffmann (Architekturbuero Hoffmann + Partner, Objektueberwachung)

TOP 1: Baustelleneinrichtung
Die Baustelleneinrichtung ist abgeschlossen. Container, Bauzaun und
Zufahrt sind eingerichtet. Stromanschluss 63A liegt vor.
Verantwortlich: Schmidt. Status: erledigt.

TOP 2: Zeitplan und Vertragslage
Der Bauzeitenplan gemaess Hauptvertrag V-2024-001 wird bestaetigt.
Baubeginn erfolgt planmaessig am 02.01.2024 mit Abbrucharbeiten durch
Mueller Bau (Vertrag V-2024-002). Alle Nachunternehmervertraege sind
unterzeichnet (V-2024-002 bis V-2024-005).

TOP 3: Sicherheitsunterweisung
Bauleiter Schmidt fuehrt Sicherheitsunterweisung durch. Alle Gewerke
bestaetigen Kenntnisnahme SiGe-Plan. Erste-Hilfe-Kasten im Container.

TOP 4: Verschiedenes
Frau Hoffmann weist auf Ergebnisse der Bestandsaufnahme hin. Einzelne
Bauteile zeigen staerkere Schaeden als erwartet. Detaillierte Pruefung
laeuft (siehe Planungsbesprechung vom 10.01.2024).

Naechster Termin: 29.01.2024, 10:00 Uhr

Protokollant: Thomas Schmidt, Bauleiter
Verteiler: alle Teilnehmer, Dr. Richter (Stadtpark Immobilien AG)`,
  '/03_protokolle/baustellenbesprechung/2024-01-29_baubesprechung_nr002.txt': `PROTOKOLL BAUBESPRECHUNG NR. 002
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 29.01.2024, 10:00 Uhr
Ort: Baucontainer Stadtpark, Stadtparkstrasse 15, Berlin-Charlottenburg

Teilnehmer:
- Thomas Schmidt (Hochbau Schmidt GmbH, Bauleitung)
- Hans Mueller (Mueller Bau GmbH & Co. KG, Rohbau)
- Frank Berger (Elektro Berger OHG, Elektro)
- Peter Weber (Sanitaer Weber GmbH, Sanitaer/Heizung)
- Maria Hoffmann (Architekturbuero Hoffmann + Partner, Objektueberwachung)

TOP 1: Baustands-Bericht Rohbau
Mueller Bau liegt ca. 5 Werktage hinter dem Terminplan zurueck.
Herr Mueller begruendet den Rueckstand mit schlechter Witterung
(Dauerregen KW 3, Temperaturen unter 0°C KW 4). Betonarbeiten in
der Tiefgarage mussten zeitweise eingestellt werden.
Bauleiter Schmidt mahnt zur Aufholung und verweist auf die
Vertragsstrafenregelung gemaess V-2024-001 ss 5.

TOP 2: Mangel M-001 — Riss in Tiefgaragendecke
Am 28.01.2024 wurde ein ca. 2 m langer Riss in der Tiefgaragendecke
im Bereich Achse B3-C3 festgestellt. Der Riss ist augenscheinlich
nicht nur oberflaechlich. Frau Hoffmann ordnet eine gutachterliche
Untersuchung an. Mueller Bau wird als verantwortliches Gewerk
benannt. Maengelruege wird vorbereitet.

TOP 3: Nachtrag NT-001 angekuendigt
Aufgrund der bei den Abbrucharbeiten festgestellten Durchfeuchtungen
der Bodenplatte (Tiefgarage) sind zusaetzliche Abdichtungsarbeiten
erforderlich. Mueller Bau kuendigt ein Nachtragsangebot an.
Rechtsgrundlage: ss 2 Abs. 5 VOB/B.

TOP 4: Stand Elektro- und Sanitaerarbeiten
Elektro Berger: Bestandsaufnahme laeuft planmaessig. Erste
Schlitzarbeiten ab KW 6. Mangel M-004 (Sicherungskasten UG falsch
verdrahtet) wird bis 25.01.2024 behoben — Nachtrag: ist bereits behoben.
Sanitaer Weber: Demontage Altleitungen im UG begonnen.

TOP 5: Verschiedenes
Frau Hoffmann erinnert an ausstehende Planlieferung Fassadendetail.
Liefertermin ist ueberfaellig.

Naechster Termin: 12.02.2024, 10:00 Uhr

Protokollant: Thomas Schmidt, Bauleiter
Verteiler: alle Teilnehmer, Dr. Richter (Stadtpark Immobilien AG)`,
  '/03_protokolle/baustellenbesprechung/2024-02-12_baubesprechung_nr003.txt': `PROTOKOLL BAUBESPRECHUNG NR. 003
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 12.02.2024, 10:00 Uhr
Ort: Baucontainer Stadtpark, Stadtparkstrasse 15, Berlin-Charlottenburg

Teilnehmer:
- Thomas Schmidt (Hochbau Schmidt GmbH, Bauleitung)
- Hans Mueller (Mueller Bau GmbH & Co. KG, Rohbau)
- Frank Berger (Elektro Berger OHG, Elektro)
- Peter Weber (Sanitaer Weber GmbH, Sanitaer/Heizung)
- Michael Kern (Fassaden Kern AG, Fassade)
- Maria Hoffmann (Architekturbuero Hoffmann + Partner, Objektueberwachung)

TOP 1: Behinderungsanzeige Mueller Bau
Herr Mueller hat am 15.02.2024 eine formale Behinderungsanzeige
gemaess ss 6 Abs. 1 VOB/B angekuendigt (liegt zum Zeitpunkt der
Besprechung noch nicht schriftlich vor). Begruendung: verspaetete
Planlieferung Fassadendetail und unvorhergesehene Bodenverhaeltnisse
Tiefgarage. Mueller fordert 3 Wochen Bauzeitverlaengerung.
Bauleiter Schmidt weist darauf hin, dass die Planlieferung am
05.02.2024 erfolgt ist und der Verzug vor der Planlieferung begann.
Die Behinderungsanzeige wird nach Eingang schriftlich beantwortet.

TOP 2: Neue Maengel M-002 und M-003
M-002: Fenster in Wohnung 3.04 (OG3, Nordseite) undicht. Bei
Schlagregen Regenwassereintritt. Verantwortlich: Fassaden Kern AG.
Herr Kern sagt Pruefung bis 16.02.2024 zu.
M-003: Estrichhoehe im EG-Flur weicht um 12 mm von Sollhoehe ab.
Niveauunterschied zur Tiefgaragenzufahrt problematisch (Barrierefreiheit).
Verantwortlich: Mueller Bau. Frist: 28.02.2024.

TOP 3: Nachtraege
NT-001 (Tiefgarage Abdichtung, 45.000 EUR): genehmigt am 12.02.2024.
NT-002 (Fassade Daemmung, 28.000 EUR): von Fassaden Kern eingereicht,
Pruefung durch Bauleitung laeuft.
NT-003 (Elektro Zusatzsteckdosen, 12.500 EUR): STRITTIG.
Bauleiter Schmidt ist der Auffassung, dass die Leistung im Vertrag
V-2024-003 enthalten ist (Pos. 04.12 Steckdosenausstattung).
Herr Berger besteht auf Nachtragsberechtigung gemaess ss 2 Abs. 6 VOB/B.

TOP 4: Terminplan
Gesamtterminplan ist durch Verzoegerung Mueller Bau gefaehrdet.
Rohbau-Fertigstellung 30.04.2024 kann bei aktuellem Tempo nicht
gehalten werden. Schmidt fordert von Mueller verstaerkten
Personaleinsatz ab KW 8.

Naechster Termin: 26.02.2024, 10:00 Uhr

Protokollant: Thomas Schmidt, Bauleiter
Verteiler: alle Teilnehmer, Dr. Richter (Stadtpark Immobilien AG)`,
  '/03_protokolle/planungsbesprechung/2024-01-10_planungsbesprechung_nr001.txt': `PROTOKOLL PLANUNGSBESPRECHUNG NR. 001
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 10.01.2024, 14:00 Uhr
Ort: Buero Architekturbuero Hoffmann + Partner

Teilnehmer:
- Maria Hoffmann (Architekturbuero Hoffmann + Partner)
- Thomas Schmidt (Hochbau Schmidt GmbH, Bauleitung)
- Dr. Klaus Richter (Stadtpark Immobilien AG, Bauherr)

TOP 1: Ausfuehrungsplanung Status
Grundrisse EG bis OG2 liegen in Version 2 vor. OG3 bis OG11 in
Bearbeitung. Fassadendetails werden bis Ende Januar geliefert.
Statische Nachweise gemaess Pruefbericht PSN-2023-0847 sind
beruecksichtigt.

TOP 2: Materialfreigaben
Fensterprofil Schuecos ASS 70 FD freigegeben. Daemmplatten
Mineralwolle WLG 035 freigegeben. Betonguete C30/37 fuer
Tiefgarage bestaetigt.

TOP 3: Bestandsaufnahme Ergebnisse
Frau Hoffmann berichtet: Die Bestandsaufnahme zeigt in den Geschossen
3 bis 5 staerkere Schaeden an der Tragstruktur als erwartet. Einzelne
Stuetzen weisen Betonabplatzungen und freiliegende Bewehrung auf.
Empfehlung: ergaenzende Sanierungsmassnahmen einplanen.
Dies wird voraussichtlich einen Nachtrag zum Hauptvertrag V-2024-001
erfordern (spaeter als Nachtrag Nr. 1 formalisiert).

TOP 4: Naechste Schritte
- Hoffmann liefert Grundriss OG3 bis 20.01.2024
- Hoffmann liefert Fassadendetails bis 31.01.2024
- Schmidt meldet Schadensbefund an Stadtpark AG

Naechster Termin: 07.02.2024, 14:00 Uhr

Protokollant: Maria Hoffmann
Verteiler: alle Teilnehmer`,
  '/03_protokolle/planungsbesprechung/2024-02-07_planungsbesprechung_nr002.txt': `PROTOKOLL PLANUNGSBESPRECHUNG NR. 002
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 07.02.2024, 14:00 Uhr
Ort: Buero Architekturbuero Hoffmann + Partner

Teilnehmer:
- Maria Hoffmann (Architekturbuero Hoffmann + Partner)
- Thomas Schmidt (Hochbau Schmidt GmbH, Bauleitung)

TOP 1: Fassade Planungsaenderung
Aufgrund der am 01.02.2024 in Kraft getretenen Aenderung der
Energieeinsparverordnung (EnEV) muss die Daemmstaerke der Fassade
von 160 mm auf 200 mm erhoeht werden. Dies erfordert eine
Planungsrevision der Fassadendetails und loest Nachtrag NT-002
fuer Fassaden Kern AG aus.

TOP 2: Grundriss-Anpassung OG3
Grundriss OG3 wurde in Version 2 ueberarbeitet. Wohnung 3.04
(Nordseite) erhaelt geaenderten Fenstereinteilung wegen
Schallschutzanforderungen Stadtparkseite. Planlieferung an
alle Gewerke erfolgt am 05.02.2024.

TOP 3: Elektroplanung Revision
Verteilerschema muss an geaenderten Grundriss OG3 angepasst
werden. Betrifft Vertrag V-2024-003 (Elektro Berger). Aenderung
der Leitungsfuehrung in Wohnungen 3.01 bis 3.06.

TOP 4: Verschiedenes
Frau Hoffmann weist auf ueberfaellige Planlieferung Fassadendetail
hin — Lieferung erfolgte verspaetet am 05.02.2024 (Soll: 31.01.2024).
Die Verspaetung koenne von Mueller Bau als Behinderungsgrund
geltend gemacht werden.

Naechster Termin: 21.02.2024, 14:00 Uhr

Protokollant: Maria Hoffmann
Verteiler: alle Teilnehmer`,

  // ── 04 Maengel (Defects / Punch Lists) ───────────────────────────
  '/04_maengel/offen/mangel_001_riss_tiefgarage.txt': `MAENGELBERICHT
Projekt: Sanierung Hochhaus am Stadtpark
Mangel-Nr.: M-001

Datum Feststellung: 28.01.2024
Festgestellt durch: Thomas Schmidt, Bauleiter

Ort: Tiefgarage, Deckenbereich Achse B3-C3
Bauabschnitt: Tiefgarage

Beschreibung:
Riss in der Tiefgaragendecke, ca. 2 m Laenge, Richtung laengs zur
Achse B3-C3. Der Riss ist nicht nur oberflaechlich — an mehreren
Stellen ist Feuchtigkeit sichtbar. Rissbreite variiert zwischen
0,3 mm und 0,8 mm. Verdacht auf Durchfeuchtung der Bodenplatte
von oben (siehe auch NT-001).

Verantwortliches Gewerk: Rohbau (Mueller Bau GmbH & Co. KG)
Bezugsvertrag: V-2024-002

Frist zur Beseitigung: 15.02.2024
Rechtsgrundlage: ss 13 Abs. 5 Nr. 1 VOB/B (Maengelansprueche)

Massnahmen:
- Gutachterliche Untersuchung angeordnet (Ergebnis ausstehend)
- Fotodokumentation angelegt (Anlage M-001-Fotos)
- Maengelruege an Mueller Bau versendet am 01.02.2024

Status: OFFEN

_________________________
Thomas Schmidt, Bauleiter
Hochbau Schmidt GmbH`,
  '/04_maengel/offen/mangel_002_fenster_undicht_og3.txt': `MAENGELBERICHT
Projekt: Sanierung Hochhaus am Stadtpark
Mangel-Nr.: M-002

Datum Feststellung: 08.02.2024
Festgestellt durch: Thomas Schmidt, Bauleiter

Ort: Wohnung 3.04, 3. Obergeschoss, Nordseite
Bauabschnitt: Fassade / Fenster

Beschreibung:
Fenster in Wohnung 3.04 (Nordseite) undicht. Bei Schlagregen tritt
Regenwasser im unteren Blendrahmenbereich ein. Wasserspuren an der
Fensterbank und am angrenzenden Putz sichtbar. Vermutliche Ursache:
fehlerhafte Abdichtung der Fenstermontage im Bereich der unteren
Anschlussfuge (RAL-Montage nicht eingehalten).

Verantwortliches Gewerk: Fassade (Fassaden Kern AG)
Bezugsvertrag: V-2024-005

Frist zur Beseitigung: 22.02.2024
Rechtsgrundlage: ss 13 Abs. 5 Nr. 1 VOB/B (Maengelansprueche)

Massnahmen:
- Sofortmassnahme: provisorische Abdichtung mit Klebeband
- Pruefung der uebrigen Fenster OG3 Nordseite angeordnet
- Fassaden Kern AG zur Stellungnahme aufgefordert

Status: OFFEN

_________________________
Thomas Schmidt, Bauleiter
Hochbau Schmidt GmbH`,
  '/04_maengel/offen/mangel_003_estrich_hoehe_eg.txt': `MAENGELBERICHT
Projekt: Sanierung Hochhaus am Stadtpark
Mangel-Nr.: M-003

Datum Feststellung: 10.02.2024
Festgestellt durch: Maria Hoffmann, Architektin (Objektueberwachung)

Ort: Erdgeschoss, Flurbereich vor Aufzug / Zugang Tiefgarage
Bauabschnitt: Rohbau / Estrich

Beschreibung:
Die Estrichhoehe im EG-Flur weicht um 12 mm von der Sollhoehe
(OKFF +0,00) ab. An der Uebergangsstelle zur Tiefgaragenzufahrt
entsteht ein Niveauunterschied, der die Barrierefreiheit
beeintraechtigt. Die Schwelle ueberschreitet die zulässige Hoehe
von 20 mm gemaess DIN 18040-2 (barrierefreies Bauen).

Verantwortliches Gewerk: Rohbau (Mueller Bau GmbH & Co. KG)
Bezugsvertrag: V-2024-002

Frist zur Beseitigung: 28.02.2024
Rechtsgrundlage: ss 13 Abs. 5 Nr. 1 VOB/B (Maengelansprueche)

Massnahmen:
- Nivellierungsmessung durchgefuehrt (Protokoll liegt vor)
- Ausgleich durch Nacharbeiten am Estrich erforderlich
- Mueller Bau zur Nachbesserung aufgefordert

Status: OFFEN

_________________________
Thomas Schmidt, Bauleiter
Hochbau Schmidt GmbH`,
  '/04_maengel/behoben/mangel_004_elektro_sicherungskasten.txt': `MAENGELBERICHT
Projekt: Sanierung Hochhaus am Stadtpark
Mangel-Nr.: M-004

Datum Feststellung: 22.01.2024
Festgestellt durch: Thomas Schmidt, Bauleiter
Datum Beseitigung: 25.01.2024

Ort: Untergeschoss, Hauptverteilung / Sicherungskasten TG
Bauabschnitt: Elektroinstallation

Beschreibung:
Sicherungskasten im UG (Technikraum Tiefgarage) falsch verdrahtet.
Der FI-Schutzschalter (RCD 30mA) fuer den Stromkreis Tiefgarage
war nicht normkonform angeschlossen — Neutralleiter und Schutzleiter
vertauscht. Bei Pruefung durch Bauleiter Schmidt mittels
Schleifenimpedanzmessung festgestellt.

Verantwortliches Gewerk: Elektro (Elektro Berger OHG)
Bezugsvertrag: V-2024-003

Durchgefuehrte Beseitigung:
- Korrekte Verdrahtung des FI-Schutzschalters am 25.01.2024
- Pruefung aller RCD-Stromkreise im UG
- Messprotokoll nach DIN VDE 0100-600 erstellt

Abnahme der Maengelbeseitigung:
Durch Bauleiter Schmidt am 25.01.2024 abgenommen.
Messprotokoll liegt vor. Maengel beseitigt.

Status: BEHOBEN

_________________________
Thomas Schmidt, Bauleiter
Hochbau Schmidt GmbH`,
  '/04_maengel/behoben/mangel_005_sanitaer_rohrbruch_ug.txt': `MAENGELBERICHT
Projekt: Sanierung Hochhaus am Stadtpark
Mangel-Nr.: M-005

Datum Feststellung: 03.02.2024
Festgestellt durch: Peter Weber, Sanitaer Weber GmbH
Datum Beseitigung: 04.02.2024

Ort: Untergeschoss, Technikraum, Kaltwasser-Hauptleitung
Bauabschnitt: Sanitaerinstallation

Beschreibung:
Rohrbruch an der Kaltwasserleitung DN 50 im UG-Technikraum.
Bruchstelle an einer Verschraubung (Altbestand, Stahlrohr
verzinkt). Wasseraustritt ca. 2 Liter/Minute. Schaden wurde
bei Routinekontrolle durch Herrn Weber entdeckt.

Verantwortliches Gewerk: Sanitaer (Sanitaer Weber GmbH)
Bezugsvertrag: V-2024-004

Durchgefuehrte Beseitigung:
Sofortmassnahme (03.02.2024):
- Absperrung Kaltwasser-Hauptleitung
- Provisorische Reparatur mit Reparaturschelle

Regulaere Reparatur (04.02.2024):
- Austausch des defekten Rohrabschnitts (ca. 1,5 m)
- Einbau neuer Edelstahl-Pressfittings
- Druckpruefung mit 10 bar, 30 Minuten, dicht

Abnahme der Maengelbeseitigung:
Durch Bauleiter Schmidt am 04.02.2024 abgenommen.
Druckpruefprotokoll liegt vor. Maengel beseitigt.

Status: BEHOBEN

_________________________
Thomas Schmidt, Bauleiter
Hochbau Schmidt GmbH`,

  // ── 05 Plaene (Plans / Drawings) ─────────────────────────────────
  '/05_plaene/grundrisse/grundriss_eg_v3.txt': `PLANMETADATEN — GRUNDRISS ERDGESCHOSS
Plannummer: A-EG-001-v3
Planbezeichnung: Grundriss Erdgeschoss — Version 3
Massstab: 1:100
Datum: 2024-01-28
Ersteller: Architekturbuero Hoffmann + Partner, M. Hoffmann
Version: 3.0 (ersetzt v2 vom 2024-01-10)
Freigabestatus: FREIGEGEBEN (Freigabe Hoffmann 2024-01-29)

Aenderungshistorie:
  v1 (2023-11-15): Erstentwurf
  v2 (2024-01-10): Anpassung Treppenhausbreite nach Brandschutzgutachten
  v3 (2024-01-28): Estrichhoehen-Korrektur nach Mangelmeldung M-003

Planinhalt:
  Darstellung Erdgeschoss mit Eingangsbereich (Foyer 8,5 x 6,2 m),
  zentrales Treppenhaus (3-laeulig, Breite 1,30 m nach DIN 18065),
  Aufzugschacht (1,60 x 2,10 m), 4 Gewerbeeinheiten (GE-01 bis GE-04),
  Zugang Tiefgarage ueber Rampe Achse A1-A3 (Gefaelle 15%).
  Bemasung aller Raeume, Wandstaerken und Oeffnungen.
  Achsraster: A-F (laengs) x 1-8 (quer), Rasterabstand 5,40 m.

Verweise: Vertrag V-2024-001, Mangel M-003 (Estrichhoehen EG)
Zeichnungsdatei: grundriss_eg_v3.svg`,

  '/05_plaene/grundrisse/grundriss_og1_v2.txt': `PLANMETADATEN — GRUNDRISS 1. OBERGESCHOSS
Plannummer: A-OG1-001-v2
Planbezeichnung: Grundriss 1. Obergeschoss — Version 2
Massstab: 1:100
Datum: 2024-01-15
Ersteller: Architekturbuero Hoffmann + Partner, M. Hoffmann
Version: 2.0 (ersetzt v1 vom 2023-11-20)
Freigabestatus: FREIGEGEBEN (Freigabe Hoffmann 2024-01-16)

Aenderungshistorie:
  v1 (2023-11-20): Erstentwurf
  v2 (2024-01-15): Installationsschaechte angepasst nach Abstimmung Sanitaer Weber

Planinhalt:
  6 Wohneinheiten (WE-101 bis WE-106, 45-85 qm), zentrales Treppenhaus,
  Aufzugschacht, 2 Installationsschaechte (IS-01 Nord, IS-02 Sued).
  Raumaufteilung: Wohnen/Essen, Schlafen, Bad, Flur je Einheit.
  Achsraster: A-F x 1-8, identisch zu EG.

Verweise: Vertrag V-2024-004 (Sanitaer Weber), Planlieferliste Anlage 2
Zeichnungsdatei: grundriss_og1_v2.svg`,

  '/05_plaene/grundrisse/grundriss_og2_v2.txt': `PLANMETADATEN — GRUNDRISS 2. OBERGESCHOSS
Plannummer: A-OG2-001-v2
Planbezeichnung: Grundriss 2. Obergeschoss — Version 2
Massstab: 1:100
Datum: 2024-01-15
Ersteller: Architekturbuero Hoffmann + Partner, M. Hoffmann
Version: 2.0
Freigabestatus: FREIGEGEBEN (Freigabe Hoffmann 2024-01-16)

Aenderungshistorie:
  v1 (2023-11-20): Erstentwurf
  v2 (2024-01-15): Installationsschaechte angepasst (wie OG1)

Planinhalt:
  6 Wohneinheiten (WE-201 bis WE-206), Grundrissaufteilung identisch
  zu 1. OG. Treppenhaus, Aufzug, Installationsschaechte IS-01/IS-02.

Verweise: Vertrag V-2024-001, Grundriss OG1 (A-OG1-001-v2)`,

  '/05_plaene/schnitte/laengsschnitt_a_a.txt': `PLANMETADATEN — LAENGSSCHNITT A-A
Plannummer: A-LS-001
Planbezeichnung: Laengsschnitt A-A (Achse 4)
Massstab: 1:50
Datum: 2024-01-20
Ersteller: Architekturbuero Hoffmann + Partner, M. Hoffmann
Version: 1.0
Freigabestatus: FREIGEGEBEN (Freigabe Hoffmann 2024-01-22)

Planinhalt:
  Schnittdarstellung durch Gebaeudelaengsachse (Achse 4):
  - Tiefgarage: UK Bodenplatte -3,60 m, OK Decke -0,30 m
  - Erdgeschoss: OK FFB +/-0,00 m, Geschosshoehe 3,50 m (lichte Hoehe 3,00 m)
  - OG 1-12: Geschosshoehe je 2,90 m (lichte Hoehe 2,55 m)
  - Dachaufbau: Flachdach mit 2% Gefaelle, Attika +38,10 m
  - Deckenstaerken: 25 cm Stahlbeton (EG-OG12), 30 cm (TG-Decke)
  - Fundamenttiefe: UK Gruendung -4,50 m, Streifenfundamente
  - Gesamtgebaeudehoehe: 41,30 m (OK Attika)

Verweise: Vertrag V-2024-001, Nachtrag NT-001 (Tiefgarage Abdichtung)
Zeichnungsdatei: laengsschnitt_a_a.svg`,

  '/05_plaene/schnitte/querschnitt_b_b.txt': `PLANMETADATEN — QUERSCHNITT B-B
Plannummer: A-QS-001
Planbezeichnung: Querschnitt B-B (Achse C)
Massstab: 1:50
Datum: 2024-01-20
Ersteller: Architekturbuero Hoffmann + Partner, M. Hoffmann
Version: 1.0
Freigabestatus: FREIGEGEBEN (Freigabe Hoffmann 2024-01-22)

Planinhalt:
  Schnittdarstellung durch Gebaeudequerachse (Achse C):
  - Fassadenaufbau Ost: WDVS 160 mm (nach Nachtrag NT-002: Upgrade auf 200 mm)
  - Fassadenaufbau West: WDVS 160 mm (geplant, Ausfuehrung durch Fassaden Kern)
  - Treppenhausposition: zentral, Breite 6,20 m
  - Installationsschaechte IS-01 (Nord) und IS-02 (Sued), je 0,80 x 0,60 m

Verweise: Vertrag V-2024-005 (Fassaden Kern), Nachtrag NT-002 (Daemmung)`,

  '/05_plaene/details/detail_fassadenanschluss.txt': `PLANMETADATEN — DETAILZEICHNUNG FASSADENANSCHLUSS
Plannummer: A-DET-F01
Planbezeichnung: Detail Fassadenanschluss Fenster — Regelgeschoss
Massstab: 1:5
Datum: 2024-02-10
Ersteller: Architekturbuero Hoffmann + Partner, M. Hoffmann
Version: 1.0
Freigabestatus: IN PRUEFUNG (Pruefung durch Fassaden Kern ausstehend)

Planinhalt:
  Detaildarstellung Fensteranschluss im Regelgeschoss (Sturzbereich):
  - Bestandswand: Stahlbeton 25 cm
  - WDVS-Aufbau: Klebemoertel 5 mm, Daemmplatte EPS 200 mm (gemaess NT-002),
    Armierungsschicht 5 mm, Schlussbeschichtung Silikonharzputz 3 mm
  - Fensterrahmen: Kunststoff, 3-fach Verglasung, Uw 0,95 W/(m2K)
  - Abdichtungsebene: Kompriband aussen, Folienbahn innen
  - Dampfbremse: sd-Wert >= 2 m, Anschluss an Fensterrahmen mit Klebeband
  - Fensterbank: Aluminium, 3% Gefaelle nach aussen

Hinweis: Daemmstaerke 200 mm gemaess Nachtrag NT-002 (Upgrade von 160 mm
auf 200 mm nach EnEV-Neuberechnung). Ausfuehrung durch Fassaden Kern (V-2024-005).

Verweise: Nachtrag NT-002, Vertrag V-2024-005`,

  '/05_plaene/details/detail_tiefgarage_abdichtung.txt': `PLANMETADATEN — DETAILZEICHNUNG ABDICHTUNG TIEFGARAGE
Plannummer: A-DET-TG01
Planbezeichnung: Detail Abdichtung Bodenplatte Tiefgarage
Massstab: 1:10
Datum: 2024-02-05
Ersteller: Architekturbuero Hoffmann + Partner, M. Hoffmann
Version: 1.0
Freigabestatus: FREIGEGEBEN (Freigabe Hoffmann 2024-02-06)

Planinhalt:
  Detaildarstellung Abdichtung Bodenplatte Tiefgarage (Bereich Achse B2-D6):
  - Erdreich / Sauberkeitsschicht: Magerbeton 5 cm
  - Abdichtungsbahn: 2-lagige Bitumenschweissbahn (DIN 18533, Klasse W2.1-E)
  - Schutzschicht: PE-Noppenfolie 10 mm
  - Drainageschicht: Filtervlies + Kiespackung 15 cm, DN 100 Drainrohr
  - Bodenplatte: Stahlbeton C30/37, d=30 cm, Bewehrung oben und unten
  - Beschichtung: Epoxidharz-Bodenbeschichtung (Tiefgarage)

Hinweis: Abdichtung wurde im Nachtrag NT-001 zusaetzlich beauftragt
(Wassereintritt Achse B3, Mangel M-001). Ausfuehrung Mueller Bau (V-2024-002).
Maengelbeseitigung M-001 in Arbeit, Frist bis 2024-02-28.

Verweise: Nachtrag NT-001, Mangel M-001, Vertrag V-2024-002`,

  // ── 06 Schriftverkehr (Correspondence) ───────────────────────────
  '/06_schriftverkehr/eingehend/2024-01-20_stadtpark_ag_freigabe_rohbau.txt': `Stadtpark Immobilien AG
Kurfuerstendamm 42, 10719 Berlin

An:
Hochbau Schmidt GmbH
Herrn Thomas Schmidt
Berliner Strasse 17, 10715 Berlin

Berlin, den 20.01.2024

Betreff: Freigabe Rohbauarbeiten
Bezug: Hauptvertrag V-2024-001 vom 15.12.2023, ss 3

Sehr geehrter Herr Schmidt,

nach Pruefung der von Architekturbuero Hoffmann + Partner vorgelegten
Ausfuehrungsplanung (Planstand Januar 2024) erteilen wir hiermit die
Freigabe fuer den Beginn der Rohbauarbeiten gemaess Vertrag V-2024-001 ss 3.

Die Freigabe umfasst die Positionen 01.01 bis 01.48 des
Leistungsverzeichnisses (Nachunternehmervertrag V-2024-002, Mueller Bau).

Bitte beachten Sie die Auflagen aus dem Pruefbericht Standsicherheit
(PSN-2023-0847), insbesondere die Abstuetzungsvorschriften fuer die
Stuetzen Achse B2 bis B8.

Mit freundlichen Gruessen

Dr. Klaus Richter
Vorstand, Stadtpark Immobilien AG`,
  '/06_schriftverkehr/eingehend/2024-02-05_archbuero_hoffmann_planlieferung.txt': `Architekturbuero Hoffmann + Partner
Savignyplatz 3, 10623 Berlin

An:
Hochbau Schmidt GmbH
Herrn Thomas Schmidt
Berliner Strasse 17, 10715 Berlin

Berlin, den 05.02.2024

Betreff: Planlieferung — ueberarbeitete Zeichnungen
Bezug: Planungsbesprechung vom 10.01.2024

Sehr geehrter Herr Schmidt,

hiermit ueberreichen wir Ihnen folgende ueberarbeitete Planunterlagen:

1. Grundriss OG3, Version 2 (Zeichnungs-Nr. A-GR-OG3-v2)
   — Geaenderte Fenstereinteilung Wohnung 3.04 (Nordseite)
   — Anpassung Elektroverteilung Wohnungen 3.01 bis 3.06
2. Fassadendetail, Version 4 (Zeichnungs-Nr. A-FD-01-v4)
   — Aktualisierte Daemmstaerke 200mm gemaess EnEV-Aenderung
   — Ueberarbeitete Fensteranschlussdetails

Hinweis: Die Lieferung des Fassadendetails erfolgt mit 5 Tagen
Verspaetung gegenueber dem vereinbarten Termin (Soll: 31.01.2024).
Wir bitten die Verzoegerung zu entschuldigen.

Bitte verteilen Sie die Plaene an die betroffenen Gewerke.

Mit freundlichen Gruessen

Maria Hoffmann
Architekturbuero Hoffmann + Partner`,
  '/06_schriftverkehr/eingehend/2024-02-15_mueller_bau_behinderungsanzeige.txt': `Mueller Bau GmbH & Co. KG
Industriestrasse 5, 12099 Berlin

An:
Hochbau Schmidt GmbH
Herrn Thomas Schmidt
Berliner Strasse 17, 10715 Berlin

Berlin, den 15.02.2024

Betreff: Behinderungsanzeige gemaess ss 6 Abs. 1 VOB/B
Bezug: Nachunternehmervertrag V-2024-002 vom 18.12.2023

Sehr geehrter Herr Schmidt,

hiermit zeigen wir Ihnen gemaess ss 6 Abs. 1 VOB/B an, dass die
Ausfuehrung unserer Rohbauarbeiten behindert ist. Die Behinderung
ergibt sich aus folgenden Umstaenden:

a) Verspaetete Planlieferung Fassadendetail
   Die fuer den 31.01.2024 zugesagte Lieferung des Fassadendetails
   (Zeichnung A-FD-01) erfolgte erst am 05.02.2024. Dadurch konnten
   die Anschlussarbeiten Rohbau/Fassade nicht termingerecht begonnen
   werden.

b) Unvorhergesehene Bodenverhaeltnisse Tiefgarage
   Die bei den Abbrucharbeiten festgestellten Durchfeuchtungen und
   Schaeden an der Bodenplatte der Tiefgarage (vgl. Mangel M-001)
   waren aus den Bestandsunterlagen nicht ersichtlich und erfordern
   zusaetzliche Abdichtungsarbeiten (Nachtrag NT-001).

Aufgrund der vorgenannten Behinderungen fordern wir eine
Bauzeitverlaengerung von 3 Wochen gemaess ss 6 Abs. 4 VOB/B.

Wir behalten uns ausdruecklich Schadensersatzansprueche und
Mehrkostenansprueche vor.

Mit freundlichen Gruessen

Hans Mueller
Prokurist, Mueller Bau GmbH & Co. KG`,
  '/06_schriftverkehr/ausgehend/2024-01-18_schmidt_an_stadtpark_ag_terminplan.txt': `Hochbau Schmidt GmbH
Berliner Strasse 17, 10715 Berlin

An:
Stadtpark Immobilien AG
Dr. Klaus Richter
Kurfuerstendamm 42, 10719 Berlin

Berlin, den 18.01.2024

Betreff: Uebersendung aktualisierter Bauzeitenplan
Bezug: Hauptvertrag V-2024-001 vom 15.12.2023

Sehr geehrter Herr Dr. Richter,

hiermit ueberreichen wir Ihnen den aktualisierten Bauzeitenplan
fuer das Projekt Sanierung Hochhaus am Stadtpark.

Meilensteine:
- Rohbau fertiggestellt: 15.03.2024
- Fassade fertiggestellt: 15.06.2024
- Haustechnik fertiggestellt: 31.07.2024
- Innenausbau fertiggestellt: 15.09.2024
- Gesamtfertigstellung / Abnahme: 30.09.2024

Der Bauzeitenplan beruecksichtigt die vertraglich vereinbarten
Zwischentermine gemaess V-2024-001 ss 4. Alle Nachunternehmer
sind vertraglich gebunden und haben ihre Leistungsbereitschaft
bestaetigt.

Der detaillierte Balkenplan (Anlage) zeigt die Abhaengigkeiten
zwischen den Gewerken.

Mit freundlichen Gruessen

Thomas Schmidt
Geschaeftsfuehrer, Hochbau Schmidt GmbH`,
  '/06_schriftverkehr/ausgehend/2024-02-01_schmidt_an_mueller_bau_maengelruege.txt': `Hochbau Schmidt GmbH
Berliner Strasse 17, 10715 Berlin

An:
Mueller Bau GmbH & Co. KG
Herrn Hans Mueller
Industriestrasse 5, 12099 Berlin

Berlin, den 01.02.2024

Betreff: Maengelruege gemaess ss 13 Abs. 5 VOB/B — Mangel M-001
Bezug: Nachunternehmervertrag V-2024-002 vom 18.12.2023

Sehr geehrter Herr Mueller,

hiermit ruegen wir folgenden Mangel an Ihren Rohbauarbeiten
gemaess ss 13 Abs. 5 Nr. 1 VOB/B:

Mangel M-001: Riss in der Tiefgaragendecke
Ort: Achse B3-C3, ca. 2 m Laenge
Festgestellt am: 28.01.2024

Der Riss wurde im Rahmen der Bauueberwachung festgestellt und
ist augenscheinlich nicht nur oberflaechlich. An der Rissstelle
sind Feuchtigkeitsspuren erkennbar. Eine gutachterliche
Untersuchung ist angeordnet.

Wir setzen Ihnen hiermit eine Frist zur Maengelbeseitigung
bis zum 15.02.2024.

Sollte die Frist fruchtlos verstreichen, behalten wir uns vor,
die Maengelbeseitigung im Wege der Ersatzvornahme auf Ihre
Kosten durchfuehren zu lassen (ss 13 Abs. 5 Nr. 2 VOB/B).

Mit freundlichen Gruessen

Thomas Schmidt
Geschaeftsfuehrer, Hochbau Schmidt GmbH`,
  '/06_schriftverkehr/ausgehend/2024-02-10_schmidt_an_elektro_berger_nachforderung.txt': `Hochbau Schmidt GmbH
Berliner Strasse 17, 10715 Berlin

An:
Elektro Berger OHG
Herrn Frank Berger
Siemensstrasse 12, 10551 Berlin

Berlin, den 10.02.2024

Betreff: Ablehnung Nachtrag NT-003 — Zusaetzliche Steckdosen
Bezug: Nachunternehmervertrag V-2024-003 vom 19.12.2023

Sehr geehrter Herr Berger,

wir nehmen Bezug auf Ihr Nachtragsangebot NT-003 vom 20.02.2024
ueber 12.500,00 EUR netto fuer zusaetzliche Steckdosen und
Datenanschluesse je Wohneinheit.

Nach eingehender Pruefung des Leistungsverzeichnisses weisen wir
Ihre Nachforderung zurueck. Die geforderten Leistungen sind
unserer Auffassung nach bereits im Vertrag V-2024-003 enthalten:

Position 4.3.1 des Leistungsverzeichnisses sieht eine
"Steckdosenausstattung je Wohneinheit nach aktuellem Standard"
vor. Der aktuelle Standard (DIN 18015-2) fordert mindestens
die von Ihnen als Nachtrag angebotene Ausstattung.

Wir fordern Sie auf, die Leistungen im Rahmen des bestehenden
Vertrags V-2024-003 ss 2 auszufuehren, ohne Nachforderung.

Sollten Sie an Ihrer Nachtragsforderung festhalten, behalten wir
uns die Einholung einer juristischen Stellungnahme vor.

Mit freundlichen Gruessen

Thomas Schmidt
Geschaeftsfuehrer, Hochbau Schmidt GmbH`,

  // ── 07 Bautagebuch (Daily Construction Logs) ─────────────────────
  '/07_bautagebuch/2024-01-15_bautagebuch.txt': `BAUTAGEBUCH
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 15.01.2024 (Montag)

Wetter: bewoelkt, 3°C, trocken, Wind schwach

Arbeitskraefte:
- Mueller Bau (Rohbau): 8 Mann — Abbrucharbeiten EG
- Elektro Berger (Elektro): 2 Mann — Bestandsaufnahme Elektro UG
Gesamtstaerke: 10 Arbeitskraefte

Geraete:
- Kleinbagger CAT 301.7, Presslufthammer, Stemmhammer elektr.

Ausgefuehrte Arbeiten:
- Abbrucharbeiten EG: Entkernung Wohnungen EG01-EG04 begonnen
- Elektro: Bestandsaufnahme Altinstallation UG, Dokumentation
  vorhandener Leitungsfuehrung
- Erste Baubesprechung Nr. 001 durchgefuehrt (10:00 Uhr)

Besondere Vorkommnisse:
Keine. Bauablauf planmaessig.

Anlieferungen:
- Container-Entsorgung (2x Mulde 10m3)

_________________________
Thomas Schmidt, Bauleiter`,
  '/07_bautagebuch/2024-01-16_bautagebuch.txt': `BAUTAGEBUCH
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 16.01.2024 (Dienstag)

Wetter: Regen (Dauerregen seit 06:00), 2°C, Wind maessig

Arbeitskraefte:
- Mueller Bau (Rohbau): 6 Mann — Abbrucharbeiten eingeschraenkt
Gesamtstaerke: 6 Arbeitskraefte (reduziert)

Geraete:
- Stemmhammer elektr. (Innenbereich)

Ausgefuehrte Arbeiten:
- Abbrucharbeiten nur im Innenbereich moeglich (EG05-EG06)
- Arbeiten im Aussenbereich ruhen wegen Naesse

Besondere Vorkommnisse:
Dauerregen seit frueh morgens. Aussenarbeiten nicht moeglich.
Mueller Bau hat 2 Mann nach Hause geschickt. Verzoegerung
gegenueber Terminplan moeglich bei anhaltendem Regen.

_________________________
Thomas Schmidt, Bauleiter`,
  '/07_bautagebuch/2024-01-17_bautagebuch.txt': `BAUTAGEBUCH
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 17.01.2024 (Mittwoch)

Wetter: trocken, 1°C, bewoelkt, Wind schwach

Arbeitskraefte:
- Mueller Bau (Rohbau): 8 Mann — Betonarbeiten Tiefgarage
- Elektro Berger (Elektro): 3 Mann — Demontage Altinstallation
Gesamtstaerke: 11 Arbeitskraefte

Geraete:
- Betonmischer, Ruettelflasche, Stemmhammer

Ausgefuehrte Arbeiten:
- Betonarbeiten Tiefgarage aufgenommen (Bodenplatte Abschnitt 1)
- Demontage Altinstallation Elektro OG1 begonnen
- Entsorgung Abbruchmaterial von gestern

Besondere Vorkommnisse:
Keine. Arbeiten wieder im Normalbetrieb nach Regentag gestern.

_________________________
Thomas Schmidt, Bauleiter`,
  '/07_bautagebuch/2024-02-01_bautagebuch.txt': `BAUTAGEBUCH
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 01.02.2024 (Donnerstag)

Wetter: sonnig, 5°C, trocken, Wind schwach

Arbeitskraefte:
- Mueller Bau (Rohbau): 6 Mann — Betonarbeiten TG (reduzierte Staerke)
- Elektro Berger (Elektro): 3 Mann — Kabelverlegung OG1
- Sanitaer Weber (Sanitaer): 2 Mann — Demontage Altleitungen UG
Gesamtstaerke: 11 Arbeitskraefte

Geraete:
- Betonmischer, Kernbohrgeraet, Rohrschneider

Ausgefuehrte Arbeiten:
- Betonarbeiten Tiefgarage Abschnitt 2 (Bodenplatte)
- Elektro: Kabelverlegung Steigeleitung OG1
- Sanitaer: Demontage Altleitungen Heizung UG

Besondere Vorkommnisse:
Bauleiter Schmidt stellt bei Kontrollgang Riss in der TG-Decke
fest (Achse B3-C3, ca. 2 m Laenge). Mangel als M-001 erfasst.
Fotodokumentation angelegt. Maengelruege an Mueller Bau wird
vorbereitet und am selben Tag versendet.

Mueller Bau mit nur 6 statt planmaessig 10 Mann vor Ort.
Herr Mueller begruendet mit Krankheitsausfaellen.

_________________________
Thomas Schmidt, Bauleiter`,
  '/07_bautagebuch/2024-02-02_bautagebuch.txt': `BAUTAGEBUCH
Projekt: Sanierung Hochhaus am Stadtpark
Datum: 02.02.2024 (Freitag)

Wetter: bewoelkt, 4°C, trocken, Wind maessig

Arbeitskraefte:
- Mueller Bau (Rohbau): 7 Mann — Betonarbeiten TG
- Elektro Berger (Elektro): 2 Mann — Kabelverlegung OG1
- Sanitaer Weber (Sanitaer): 4 Mann — Rohrinstallation UG
Gesamtstaerke: 13 Arbeitskraefte

Geraete:
- Betonmischer, Schweissgeraet, Rohrbieger, Presszange

Ausgefuehrte Arbeiten:
- Betonarbeiten TG-Decke Abschnitt 2 fortgesetzt
- Elektro: Verteiler OG1 vormontiert
- Sanitaer: Rohrinstallation Kaltwasser UG begonnen

Besondere Vorkommnisse:
Rohrbruch Kaltwasserleitung DN 50 im UG-Technikraum festgestellt
(Mangel M-005). Bruchstelle an Verschraubung Altbestand.
Sofortmassnahme: Wasserabsperrung und provisorische Reparatur
durch Sanitaer Weber. Regulaere Reparatur fuer morgen (03.02.)
geplant — Korrektur: Reparatur auf 04.02. verschoben (Samstag
keine Arbeiten).

_________________________
Thomas Schmidt, Bauleiter`,

  // ── 08 Rechnungen (Invoices) ─────────────────────────────────────
  '/08_rechnungen/geprueft/re_mueller_bau_abschlag_01.txt': `ABSCHLAGSRECHNUNG
Rechnungsnummer: RE-2024-001
Rechnungsdatum: 2024-02-01
Leistungszeitraum: 01.01.2024 — 31.01.2024

Auftragnehmer:
  Mueller Bau GmbH & Co. KG
  Hans Mueller, Geschaeftsfuehrer
  Industriestrasse 8, 12345 Berlin

Auftraggeber:
  Hochbau Schmidt GmbH
  Thomas Schmidt, Geschaeftsfuehrer
  Berliner Strasse 17, 10715 Berlin

Vertragsnummer: V-2024-002 (Rohbauarbeiten)
1. Abschlagsrechnung (30% der Gesamtauftragssumme 890.000,00 EUR)

Leistungsbeschreibung:
  LV-Pos. 01.01-01.05: Abbrucharbeiten Bestand (abgeschlossen)
  LV-Pos. 02.01-02.08: Betonarbeiten Tiefgarage (Bodenplatte, Waende)
  LV-Pos. 02.09-02.12: Bewehrungsarbeiten Tiefgarage

Nettobetrag:                267.000,00 EUR
MwSt. 19%:                   50.730,00 EUR
Bruttobetrag:               317.730,00 EUR

Zahlungsziel: 14 Tage nach Rechnungseingang (bis 2024-02-15)
Bankverbindung: Mueller Bau, IBAN DE89 3704 0044 0123 4567 89

Pruefvermerk: Sachlich und rechnerisch geprueft, Schmidt, 2024-02-05
Status: GEPRUEFT UND FREIGEGEBEN`,

  '/08_rechnungen/geprueft/re_elektro_berger_abschlag_01.txt': `ABSCHLAGSRECHNUNG
Rechnungsnummer: RE-2024-002
Rechnungsdatum: 2024-02-03
Leistungszeitraum: 15.01.2024 — 31.01.2024

Auftragnehmer:
  Elektro Berger GmbH
  Frank Berger, Geschaeftsfuehrer
  Voltastrasse 12, 10587 Berlin

Auftraggeber:
  Hochbau Schmidt GmbH
  Thomas Schmidt, Geschaeftsfuehrer
  Berliner Strasse 17, 10715 Berlin

Vertragsnummer: V-2024-003 (Elektroinstallation)
1. Abschlagsrechnung (20% der Gesamtauftragssumme 420.000,00 EUR)

Leistungsbeschreibung:
  LV-Pos. 01.01-01.03: Bestandsaufnahme Elektroinstallation
  LV-Pos. 01.04-01.06: Demontage Altinstallation (Geschosse 1-4)
  LV-Pos. 02.01: Vorbereitung Kabeltrassen UG

Nettobetrag:                 84.000,00 EUR
MwSt. 19%:                   15.960,00 EUR
Bruttobetrag:                99.960,00 EUR

Zahlungsziel: 14 Tage nach Rechnungseingang (bis 2024-02-17)
Bankverbindung: Elektro Berger, IBAN DE45 1001 0010 0987 6543 21

Pruefvermerk: Sachlich und rechnerisch geprueft, Schmidt, 2024-02-08
Status: GEPRUEFT UND FREIGEGEBEN`,

  '/08_rechnungen/geprueft/re_sanitaer_weber_abschlag_01.txt': `ABSCHLAGSRECHNUNG
Rechnungsnummer: RE-2024-003
Rechnungsdatum: 2024-02-10
Leistungszeitraum: 22.01.2024 — 07.02.2024

Auftragnehmer:
  Sanitaer Weber GmbH
  Peter Weber, Geschaeftsfuehrer
  Wasserweg 5, 10553 Berlin

Auftraggeber:
  Hochbau Schmidt GmbH
  Thomas Schmidt, Geschaeftsfuehrer
  Berliner Strasse 17, 10715 Berlin

Vertragsnummer: V-2024-004 (Sanitaerinstallation)
1. Abschlagsrechnung (15% der Gesamtauftragssumme 380.000,00 EUR)

Leistungsbeschreibung:
  LV-Pos. 01.01-01.04: Demontage Altinstallation Sanitaer (UG + EG)
  LV-Pos. 02.01-02.03: Rohrinstallation UG (Grundleitungen, Fallrohre)
  LV-Pos. 02.04: Druckpruefung Leitungsnetz UG

Hinweis: Reparatur Rohrbruch (Mangel M-005) ist NICHT in diesem
Abschlag enthalten. M-005 faellt unter Gewaehrleistung gemaess
ss 13 Abs. 5 Nr. 1 VOB/B (Mangel innerhalb Gewaehrleistungsfrist).

Nettobetrag:                 57.000,00 EUR
MwSt. 19%:                   10.830,00 EUR
Bruttobetrag:                67.830,00 EUR

Zahlungsziel: 14 Tage nach Rechnungseingang (bis 2024-02-24)
Bankverbindung: Sanitaer Weber, IBAN DE12 2004 0000 0234 5678 90

Pruefvermerk: Sachlich und rechnerisch geprueft, Schmidt, 2024-02-14
Status: GEPRUEFT UND FREIGEGEBEN`,

  '/08_rechnungen/offen/re_fassaden_kern_abschlag_01.txt': `ABSCHLAGSRECHNUNG
Rechnungsnummer: RE-2024-004
Rechnungsdatum: 2024-02-15
Leistungszeitraum: 01.02.2024 — 14.02.2024

Auftragnehmer:
  Fassaden Kern GmbH
  Michael Kern, Geschaeftsfuehrer
  Fassadenweg 22, 10961 Berlin

Auftraggeber:
  Hochbau Schmidt GmbH
  Thomas Schmidt, Geschaeftsfuehrer
  Berliner Strasse 17, 10715 Berlin

Vertragsnummer: V-2024-005 (Fassadenarbeiten)
1. Abschlagsrechnung (10% der Gesamtauftragssumme 520.000,00 EUR)

Leistungsbeschreibung:
  LV-Pos. 01.01-01.02: Geruest Teilaufbau (Suedseite, Geschosse 1-6)
  LV-Pos. 01.03: Fassadenbestandsaufnahme und Schadenskartierung
  LV-Pos. 01.04: Probeflaeche WDVS (2 x 3 m, Achse D4)

Nettobetrag:                 52.000,00 EUR
MwSt. 19%:                    9.880,00 EUR
Bruttobetrag:                61.880,00 EUR

Zahlungsziel: 14 Tage nach Rechnungseingang (bis 2024-03-01)
Bankverbindung: Fassaden Kern, IBAN DE78 3005 0110 0012 3456 78

Status: OFFEN — Eingang 2024-02-18, noch nicht geprueft`,

  '/08_rechnungen/offen/re_mueller_bau_abschlag_02.txt': `ABSCHLAGSRECHNUNG
Rechnungsnummer: RE-2024-005
Rechnungsdatum: 2024-03-01
Leistungszeitraum: 01.02.2024 — 28.02.2024

Auftragnehmer:
  Mueller Bau GmbH & Co. KG
  Hans Mueller, Geschaeftsfuehrer
  Industriestrasse 8, 12345 Berlin

Auftraggeber:
  Hochbau Schmidt GmbH
  Thomas Schmidt, Geschaeftsfuehrer
  Berliner Strasse 17, 10715 Berlin

Vertragsnummer: V-2024-002 (Rohbauarbeiten)
2. Abschlagsrechnung (25% der Gesamtauftragssumme 890.000,00 EUR)

Leistungsbeschreibung:
  LV-Pos. 03.01-03.06: Betonarbeiten OG1-OG3 (Decken, Stuetzen, Unterzuege)
  LV-Pos. 04.01-04.04: Mauerwerk OG1-OG3 (Innenwandkonstruktion)
  LV-Pos. 03.07: Treppenhaus Ortbeton Geschosse 1-3

Nettobetrag:                222.500,00 EUR
MwSt. 19%:                   42.275,00 EUR
Bruttobetrag:               264.775,00 EUR

Zahlungsziel: 14 Tage nach Rechnungseingang (bis 2024-03-15)
Bankverbindung: Mueller Bau, IBAN DE89 3704 0044 0123 4567 89

Status: OFFEN — Pruefung zurueckgestellt
Begruendung: Offene Maengel M-001 (Wassereintritt Tiefgarage) und
M-003 (Estrichhoehen EG) muessen vor Freigabe beseitigt werden.
Pruefung wird nach Maengelbeseitigung fortgesetzt.
Vgl. Baustellenprotokoll vom 2024-02-15 und Maengelberichte.`,

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
