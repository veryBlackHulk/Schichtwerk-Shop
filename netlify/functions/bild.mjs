// Holt ein Galerie-Bild von MakerWorld für den Shop (Verwalten → Vorschläge → Übernehmen).
// Der Browser darf MakerWorld-Bilder nicht direkt laden (CORS), diese Funktion schon.
// Erlaubt sind nur Design-Bilder von makerworld.bblmw.com, damit sie kein offener Proxy ist.
// Aufruf: /.netlify/functions/bild?u=<Bildadresse>

const MAX_BYTES = 5 * 1024 * 1024;

export default async (req) => {
  const u = new URL(req.url).searchParams.get('u') || '';
  let ziel;
  try { ziel = new URL(u); } catch { return new Response('Ungültige Adresse', { status: 400 }); }
  if (ziel.protocol !== 'https:' || ziel.hostname !== 'makerworld.bblmw.com' ||
      !ziel.pathname.startsWith('/makerworld/model/') || !ziel.pathname.includes('/design/')) {
    return new Response('Nicht erlaubt', { status: 403 });
  }
  // immer in handlicher Größe als WebP holen
  ziel.search = '?x-oss-process=image/resize,w_1000/format,webp';
  let r;
  try { r = await fetch(ziel, { redirect: 'error' }); } catch { return new Response('Bild nicht erreichbar', { status: 502 }); }
  if (!r.ok) return new Response('Bild nicht gefunden', { status: 502 });
  const typ = (r.headers.get('content-type') || '').split(';')[0].trim();
  if (!/^image\/(webp|jpeg|png|gif)$/.test(typ)) return new Response('Kein Bild', { status: 502 });
  const daten = await r.arrayBuffer();
  if (daten.byteLength > MAX_BYTES) return new Response('Bild zu groß', { status: 413 });
  return new Response(daten, { headers: { 'content-type': typ, 'cache-control': 'public, max-age=86400' } });
};
