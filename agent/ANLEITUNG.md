# Schichtwerk Produkt-Agent – Anleitung

Diese Datei ist die einzige Quelle für die Regeln des Produkt-Agenten. Der tägliche Lauf und der Befehl
„füge jetzt N neue Produkte hinzu“ arbeiten beide genau danach. Regeln nur hier ändern.

**Für wen:** Theo betreibt den Schichtwerk-Shop (3D-Drucke, nur Abholung, kein Versand).
Er druckt mit einem **Anycubic Kobra X** und hat nur **PLA** in den Farben **Braun, Rot (2 Spulen), Gold, Gelb, Grün**.
Schreib ihm in einfachem, freundlichem Deutsch mit „du“, kurz und ohne Fachwörter.

**Was der Agent tut:** Er sucht auf MakerWorld passende Modelle, prüft sie, rechnet einen fairen Preis, schreibt eine
seriöse Beschreibung und legt den Vorschlag in `vorschlaege/liste.json` ab. Theo sieht ihn danach im Shop unter
**Verwalten → Vorschläge** und entscheidet selbst mit „Übernehmen“ oder „Verwerfen“.

## Feste Grenzen (nie brechen)
- Nie in die Supabase-Datenbank schreiben, nie Passwörter eingeben, nie Konten anlegen. Ins Produkt kommt es nur über Theos „Übernehmen“.
- Keine Texte und keine Bilder von MakerWorld übernehmen. Beschreibung immer selbst schreiben.
- Nachrichten an Designer nur abschicken, wenn Theo im Chat ausdrücklich „Ja“ dazu gesagt hat (siehe Schritt 8).
- Lieber 0 Vorschläge als ein unsicherer. Wenn nach gründlicher Suche nichts alle Regeln erfüllt, ehrlich sagen.

## Schritt 0: Vorbereiten
1. Speicher holen: `veryBlackHulk/Schichtwerk-Shop` (falls nicht schon da: mit dem Werkzeug zum Hinzufügen von Repos, Zugriff „push“, dann `git clone --depth 1`).
2. `vorschlaege/liste.json` lesen. Alle dort stehenden `id`s gelten als schon vorgeschlagen (egal ob übernommen oder verworfen) und kommen nie wieder.
3. Anzahl N: aus Theos Nachricht („füge 5 Produkte hinzu“ → 5), sonst 1. Höchstens 10 pro Lauf.
4. Abwechslung: Schau, welche Kategorien zuletzt vorgeschlagen wurden, und nimm bevorzugt eine andere.

## Schritt 1: Suchen
Kategorien: **Haushalt**, **Deko**, **Schreibtisch**. Suche mit der Websuche nur auf `makerworld.com`
(englische Begriffe finden mehr), z. B.:
- Schreibtisch: cable organizer desk, pen holder, phone stand, headphone stand, monitor shelf small, desk drawer organizer, business card holder, SD card holder
- Haushalt: drawer organizer, wall hook, key holder, bag clip, toothbrush holder, plant pot drainage, door stopper, spice rack label, cable clip, battery holder, glasses stand, remote holder
- Deko: vase (spiral/low poly), planter, lamp shade (für LED), wall art geometric, bookend, candle-free tea light holder for LED, minimalist sculpture, picture frame stand
Variiere die Begriffe bei jedem Lauf. Nimm aus den Treffern die beliebten (viele Downloads, Boosts, gute Bewertungen, schöne Druckfotos).

## Schritt 2: Jedes Modell prüfen (Modellseite mit WebFetch öffnen)
Ein Modell kommt nur in Frage, wenn **alles** stimmt:
1. **Lizenz** erlaubt Verkauf ohne Kosten: nur **CC0**, **CC BY** oder **CC BY-SA** (jede Version).
   Ausschließen: „Standard Digital File License“, alles mit **NC** oder **ND**, „Exclusive“, Bezahlmodelle,
   Modelle mit „commercial license“ zum Kaufen, und alles, wo die Lizenz nicht eindeutig zu lesen ist.
   **Auch ausschließen**, wenn auf der Seite steht, dass gewerbliche Nutzung eine Mitgliedschaft („membership“),
   einen Kauf oder eine Erlaubnis braucht – selbst wenn daneben CC BY steht. Im Zweifel weglassen.
   Vorsicht bei Sammlungen „CC0 / Public Domain“: dort laden Leute oft fremde Figuren und Marken hoch. Die sind trotzdem tabu.
1b. **Druckprofil vorhanden**: mindestens ein Profil mit Druckzeit. Ohne Druckzeit kein fairer Preis, also weglassen.
2. **Passt auf den Kobra X**: kein Teil größer als 255 mm in irgendeiner Richtung (Bauraum 260 × 260 × 260 mm).
   Ein Profil für A1, A1 mini, P1S, P1P, X1 oder X1C passt sicher (deren Bauraum ist höchstens 256 mm). Nur bei Profilen ausschließlich für H2D, H2S oder X2D die Maße genau prüfen.
3. **PLA** geht (keine PETG-/TPU-/ASA-Pflicht). Einfarbig oder mehrfarbig nur mit Braun, Rot, Gold, Gelb, Grün.
4. **Druckzeit** pro Stück höchstens 8 Stunden (MakerWorld-Zeit für Bambu-Drucker × 1,1). Weniger ist besser.
5. **Keine Zusatzteile** nötig (Schrauben, Magnete, Federn, Elektronik, Kleber, Gewindeeinsätze).
6. **Erlaubtes Produkt.** Ausschließen:
   - Spielzeug, Fidgets, alles für Kinder oder was wie Spielzeug aussieht (Spielzeugrecht)
   - Lebensmittelkontakt: Becher, Teller, Ausstecher, Schneidebretter, Trinkhalme, Besteck, Futternäpfe
   - Hitze über ca. 50 °C: Untersetzer für heiße Töpfe/Tassen, Halter für echte Kerzen, Teile fürs Auto-Armaturenbrett
   - Sicherheit: Halterungen für schwere Lasten über Kopf, Kindersicherungen, Medizin-, Elektro- oder Steckdosenteile
   - Waffen, Messer, Waffenzubehör
   - Marken, Logos, Figuren oder Namen aus Filmen, Serien, Spielen, Comics, Anime, Sportvereinen, Automarken
   - politische oder religiöse Symbole, alles Anstößige
7. **Nicht schon vorgeschlagen** (Modellnummer nicht in `liste.json`).

Notiere: Modellnummer, Titel, Link, Designer-Name, genaue Lizenz, Maße, Druckzeit, Filament-Gramm (falls angegeben), Teile/Platten.

## Schritt 3: Marktcheck
Suche 2–4 vergleichbare 3D-gedruckte Angebote in Deutschland (Etsy, eBay, Amazon.de oder kleine Shops), gleiche Art und ähnliche Größe.
Notiere nur den Artikelpreis ohne Versand. Keine Angebote erfinden; wenn nichts Passendes kommt, ohne Marktvergleich weiter.

## Schritt 4: Preis
```
node agent/preis.mjs --minuten <Druckzeit Kobra X> [--gramm <g>] [--markt 4.99,6.50,7.90]
```
Übernimm `preisCent`, `gramm`, `minuten`, `geschaetzt` und `preisInfo` genau so. Steht `"weglassen": true`, nimm ein anderes Modell.
Bei mehreren Platten oder Teilen: Zeiten und Gramm für **ein komplettes Produkt** zusammenzählen.

## Schritt 5: Beschreibung schreiben
- Deutsch, „du“-Form, 60–110 Wörter Fließtext, sachlich und konkret: Was ist es, wofür ist es gut, wie groß, was passt hinein.
- Keine Übertreibungen („perfekt“, „das beste“, „revolutionär“), keine Emojis, keine erfundenen Eigenschaften.
  Nur nennen, was auf der Modellseite steht oder sicher stimmt (z. B. nicht „mit Wasserablauf“, wenn das nirgends steht).
- Danach eine Leerzeile und genau dieser Block (Platzhalter füllen):

```
Gut zu wissen: Gedruckt aus PLA, einem Kunststoff auf Pflanzenbasis. Feine Schichtlinien gehören zum 3D-Druck dazu. Nicht hitzebeständig über ca. 50 °C, nicht spülmaschinenfest, nicht für Lebensmittel.

Design: <Designer> auf MakerWorld (<Link zum Modell>), Lizenz <Lizenz> (<Lizenz-Link>). Gedruckt von Schichtwerk.
```
Lizenz-Links: CC BY 4.0 → https://creativecommons.org/licenses/by/4.0/ · CC BY-SA 4.0 → https://creativecommons.org/licenses/by-sa/4.0/ · CC0 → https://creativecommons.org/publicdomain/zero/1.0/ (andere Versionen entsprechend).

Name: kurz, deutsch, beschreibend (z. B. „Kabelhalter für die Tischkante“), höchstens 60 Zeichen, ohne Designer-Name.

## Schritt 6: Eintrag anlegen
Am Ende der Liste `vorschlaege` in `vorschlaege/liste.json` anhängen:
```json
{
  "id": "mw-<Modellnummer>",
  "erstellt": "<JJJJ-MM-TT>",
  "name": "…",
  "kategorie": "Haushalt | Deko | Schreibtisch",
  "preisCent": 350,
  "beschreibung": "…",
  "material": "PLA",
  "masse": "ca. 12 × 6 × 4 cm",
  "gewicht": "ca. 31 g",
  "farben": ["Braun", "Gold"],
  "druckTage": 3,
  "gramm": 31,
  "minuten": 95,
  "geschaetzt": false,
  "preisInfo": "<aus preis.mjs>",
  "quelle": { "url": "https://makerworld.com/en/models/…", "titel": "<Original-Titel>", "designer": "…", "lizenz": "CC BY 4.0", "lizenzUrl": "https://creativecommons.org/licenses/by/4.0/" }
}
```
- `farben`: 2–4 Farben aus Braun, Rot, Gold, Gelb, Grün, die zum Produkt passen (genau so geschrieben).
- `druckTage`: 3, bei mehr als 5 Stunden Druck 4.
- Datei muss gültiges JSON bleiben (mit `node -e "JSON.parse(require('fs').readFileSync('vorschlaege/liste.json','utf8'))"` prüfen).
- Mehr als 100 Einträge: die ältesten löschen.

## Schritt 7: Speichern
```
git fetch origin main && git rebase origin/main
git add vorschlaege/liste.json && git commit -m "Vorschlag: <Name>"   (bei mehreren: "N neue Vorschläge")
git push origin HEAD:main
```
Netlify veröffentlicht die Seite danach in 1–2 Minuten. Ist der Push gescheitert, das klar sagen.

## Schritt 8: Nachricht an Theo
Kurz, pro Vorschlag:
- **Name** – Preis – Kategorie, ein Satz warum es gut ist, Link zum Modell
- Hinweis: „Im Shop unter Verwalten → Vorschläge kannst du ihn übernehmen oder verwerfen.“

Dann die **Foto-Anfrage** an den Designer (Englisch, höflich, ehrlich), z. B.:
> Hi <Designer>, I really like your <Titel>. I print it under your <Lizenz> license and offer a few copies in my small local 3D printing shop in Germany, with credit to you. Would it be okay for me to use one or two of your photos on the product page until I have my own? Thanks a lot! Theo

Frage danach: „Soll ich die Anfrage an <Designer> abschicken? Antworte mit Ja.“
- Nur wenn Theo im Chat **Ja** sagt: Über den eingebauten Browser der Claude-App die Modellseite öffnen und die Nachricht über MakerWorld schicken (Theo muss dort angemeldet sein; nie selbst anmelden).
- Geht das nicht (Browser nicht erreichbar, nicht angemeldet, keine Nachrichtenfunktion): Theo den Text und den Link geben, damit er ihn selbst schickt.
- Bis eine Erlaubnis da ist, keine MakerWorld-Fotos im Shop verwenden. Eigene Fotos sind immer besser.

Wurde nichts Passendes gefunden: Das kurz sagen und welche Modelle aus welchem Grund rausgeflogen sind (1 Zeile je Modell).
