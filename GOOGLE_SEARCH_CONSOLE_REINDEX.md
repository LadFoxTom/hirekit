# 🔍 Google Search Console - Favicon Re-indexering

## Stap 1: Verifieer je site in Google Search Console

Als je site nog niet geverifieerd is:

1. Ga naar [Google Search Console](https://search.google.com/search-console)
2. Klik op **"Add Property"** of **"Add a property"**
3. Kies **"URL prefix"** en voer in: `https://www.ladderfox.com`
4. Kies een verificatiemethode:
   - **HTML tag** (aanbevolen): Kopieer de verificatiecode
   - Of gebruik **DNS-verificatie** of **HTML-bestand upload**

### HTML Tag Verificatie (via Next.js metadata)

Als je kiest voor HTML tag verificatie:

1. Kopieer de `content` waarde uit de meta tag (bijv. `abc123def456...`)
2. Voeg deze toe aan je `.env` bestand:
   ```env
   GOOGLE_SEARCH_CONSOLE_VERIFICATION=abc123def456...
   ```
3. Update `src/app/layout.tsx` om de environment variable te gebruiken:
   ```typescript
   verification: {
     google: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION || 'your-google-verification-code',
   },
   ```

## Stap 2: Vraag nieuwe indexering aan

Nadat je site geverifieerd is:

1. Ga naar [Google Search Console](https://search.google.com/search-console)
2. Selecteer je property (`https://www.ladderfox.com`)
3. In het linker menu, klik op **"URL Inspection"** (of "URL-inspectie")
4. Voer in de zoekbalk: `https://www.ladderfox.com`
5. Klik op **"Request Indexing"** (of "Indexering aanvragen")
6. Wacht op bevestiging dat de aanvraag is ingediend

## Stap 3: Controleer favicon toegankelijkheid

Voordat je de indexering aanvraagt, controleer:

1. **Favicon bereikbaar**: `https://www.ladderfox.com/favicon.ico` moet laden
2. **Logo bereikbaar**: `https://www.ladderfox.com/logo.png` moet laden
3. **Open in incognito venster** om caching te vermijden

## Stap 4: Wacht op Google crawl

- **Tijd**: Kan 1-7 dagen duren voordat Google de favicon update
- **Monitoring**: Check regelmatig in Google Search Console → **"Coverage"** of er nieuwe crawls zijn
- **Test**: Zoek na een paar dagen op "ladderfox" en check of het logo verschijnt

## Alternatief: Sitemap indienen

Je kunt ook een sitemap indienen om Google te helpen sneller te crawlen:

1. Ga naar **"Sitemaps"** in het linker menu
2. Voer in: `https://www.ladderfox.com/sitemap.xml`
3. Klik op **"Submit"**

## Tips

- **Geduld**: Google kan er enkele dagen over doen om favicons te updaten
- **Meerdere URLs**: Je kunt ook de homepage (`/`) en andere belangrijke pagina's aanvragen
- **Rich Results Test**: Gebruik [Google's Rich Results Test](https://search.google.com/test/rich-results) om te controleren of je structured data correct is

## Verificatie

Na enkele dagen, test of het werkt:

1. Zoek op Google: `site:ladderfox.com`
2. Check of het LadderFox logo verschijnt naast de zoekresultaten
3. Als het nog niet werkt, wacht nog een paar dagen en probeer opnieuw
