#!/usr/bin/env node
// Fairer Preis für einen Schichtwerk-Vorschlag.
// Aufruf:  node agent/preis.mjs --minuten 95 [--gramm 31] [--markt 4.99,6.50,7.90]
//   --minuten  Druckzeit auf dem Kobra X in Minuten (MakerWorld-Zeit für Bambu-Drucker × 1,1)
//   --gramm    Filament in Gramm; fehlt es, wird es aus der Druckzeit geschätzt (0,3 g pro Minute)
//   --markt    Preise vergleichbarer 3D-gedruckter Angebote in Euro (inkl. Versand weglassen), Komma-getrennt
// Ausgabe: JSON mit preisCent, kostenCent, gramm, geschaetzt, preisInfo, weglassen (true = zu teuer im Vergleich)

const WERTE = {
  spuleCent: 1300, spuleGramm: 1000,   // PLA-Spule 13 € / 1 kg (Angabe Theo)
  abfall: 1.1,                         // +10 % für Stützen, Ausschuss, Fehldrucke
  watt: 125, stromCentKwh: 37,         // Kobra X beim PLA-Druck, Strompreis
  verschleissCentStunde: 11,           // Drucker, Düse, Platte pro Druckstunde
  aufschlag: 1.5, arbeitCent: 100,     // Kosten × 1,5 + 1 € für Nacharbeit, Verpackung, Übergabe
  mindestCent: 200
};

const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : undefined; };
const zahl = s => s == null ? null : Number(String(s).replace(',', '.'));
const auf50 = c => Math.ceil(c / 50) * 50;
const eur = c => (c / 100).toFixed(2).replace('.', ',') + ' €';

const minuten = zahl(arg('minuten'));
if (!Number.isFinite(minuten) || minuten <= 0) { console.error('Bitte --minuten angeben, z. B. --minuten 95'); process.exit(1); }
let gramm = zahl(arg('gramm'));
const geschaetzt = !Number.isFinite(gramm) || gramm <= 0;
if (geschaetzt) gramm = Math.max(5, Math.round(minuten * 0.3));

const h = minuten / 60;
const materialCent = gramm * WERTE.abfall * WERTE.spuleCent / WERTE.spuleGramm;
const stromCent = h * WERTE.watt / 1000 * WERTE.stromCentKwh;
const verschleissCent = h * WERTE.verschleissCentStunde;
const kostenCent = Math.round(materialCent + stromCent + verschleissCent);

let preisCent = Math.max(WERTE.mindestCent, auf50(kostenCent * WERTE.aufschlag + WERTE.arbeitCent));
let weglassen = false;
let marktText = 'Kein Marktvergleich gefunden.';

const markt = (arg('markt') || '').split(/[,;\s]+/).map(zahl).filter(x => Number.isFinite(x) && x > 0).map(x => Math.round(x * 100)).sort((a, b) => a - b);
if (markt.length) {
  const mitte = markt.length % 2 ? markt[(markt.length - 1) / 2] : Math.round((markt[markt.length / 2 - 1] + markt[markt.length / 2]) / 2);
  marktText = `Vergleichbare Angebote ${eur(markt[0])}–${eur(markt[markt.length - 1])} (Mitte ${eur(mitte)}).`;
  if (preisCent > mitte) {
    // zu teuer: Richtung Markt senken, aber nie unter Kosten × 1,3
    const neu = Math.max(auf50(mitte * 0.9), auf50(kostenCent * 1.3));
    preisCent = Math.min(preisCent, neu);
    if (preisCent > mitte) weglassen = true;
  } else if (preisCent < mitte * 0.5) {
    // viel günstiger als üblich: maßvoll anheben, aber höchstens Kosten × 3 + 2 €
    const neu = Math.min(auf50(mitte * 0.6), auf50(kostenCent * 3 + 2 * WERTE.arbeitCent));
    if (neu > preisCent) preisCent = neu;
  }
}

const preisInfo = `Kosten ca. ${eur(kostenCent)} (${gramm} g PLA${geschaetzt ? ' geschätzt' : ''}, ${Math.round(minuten)} min Druck). ${marktText}` +
  (weglassen ? ' Zu teuer im Vergleich, besser weglassen.' : ` Preis ${eur(preisCent)}.`);

console.log(JSON.stringify({ preisCent, kostenCent, gramm, minuten: Math.round(minuten), geschaetzt, weglassen, preisInfo }, null, 2));
