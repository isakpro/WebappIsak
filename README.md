# Pawlog – webbapp

En dagbok för hunden. Varje dag lägger du upp en bild, en kort rubrik, en
berättelse om vad hunden gjorde och ett träningsmål som du kan bocka av när det
sitter.

Det här repot innehåller **webbappen** (React). Den är en av tre delar i
plattformen:

| Del | Teknik | Repo |
| --- | --- | --- |
| Webbapp | React + TypeScript | det här repot |
| Backend / API | ASP.NET WebAPI | [pawlog-api](https://github.com/isakpro/pawlog-api) |
| Mobilapp | React Native (Expo) | kommer |

Webbappen sparar ingenting själv. Allt går via det egna API:et, så **backend
måste köra** för att appen ska visa något.

## Kom igång

### Förutsättningar

- [Node.js](https://nodejs.org/) 20.19 eller senare (Vite 8 kräver det)
- npm (följer med Node)
- [.NET SDK 10](https://dotnet.microsoft.com/download) eller senare (för API:et)

Kontrollera versionerna:

```bash
node -v
dotnet --version
```

Du behöver **två terminalfönster**, ett för API:et och ett för webbappen. Börja
med API:et.

### 1. Starta API:et

```bash
git clone https://github.com/isakpro/pawlog-api.git
cd pawlog-api
dotnet run --project Pawlog.Api
```

API:et lyssnar på **http://localhost:5005**. Databasen är en SQLite-fil som
skapas automatiskt vid första starten med två exempelinlägg, så det behövs ingen
databasserver och inga migrationer.

Kontrollera i ett annat fönster att det svarar:

```bash
curl http://localhost:5005/api/entries
```

Låt terminalen stå kvar med API:et igång.

### 2. Starta webbappen

I ett nytt terminalfönster:

```bash
git clone https://github.com/isakpro/WebappIsak.git
cd WebappIsak
npm install
npm run dev
```

Öppna **http://localhost:5173** i webbläsaren.

Stoppa respektive server med `Ctrl + C`.

### Prova appen

- **Lista:** inläggen hämtas från API:et när sidan laddas, nyast först
- **Lägg till:** fyll i formuläret till vänster och tryck *Save entry*. Väljer du
  en bild laddas den upp och visas på kortet i listan
- **Uppdatera:** tryck *Mark as done* på ett kort för att bocka av träningsmålet

Allt sparas i API:ets databas, så det ligger kvar när du laddar om sidan.

### Om något går fel

Stäng av API:et och ladda om sidan. Då visas ett felmeddelande med en
*Try again*-knapp istället för att appen kraschar eller fastnar i laddningsläge.
Samma sak gäller när du sparar: felet visas i formuläret och det du skrivit
ligger kvar.

### API-adressen

Adressen till API:et ligger i `.env`:

```
VITE_API_URL=http://localhost:5005
```

Filen är incheckad, så appen fungerar direkt efter kloning. Kör du API:et på en
annan port lägger du din egen adress i `.env.local`, som git ignorerar.

### Övriga kommandon

| Kommando | Gör |
| --- | --- |
| `npm run dev` | Startar utvecklingsservern på port 5173 |
| `npm run build` | Typkollar och bygger en produktionsversion till `dist/` |
| `npm run preview` | Serverar den byggda versionen lokalt |
| `npm run lint` | Kör oxlint över källkoden |

## Testa att den är responsiv

Öppna DevTools (`F12`) och slå på enhetsläget (`Ctrl + Shift + M`). Layouten har
tre lägen:

- **Under 640 px (mobil):** en kolumn, formuläret ligger överst och korten under
- **640–999 px (surfplatta):** flödet blir ett rutnät som fyller på med fler kort
  per rad ju bredare skärmen är
- **Från 1000 px (desktop):** formuläret flyttar ut till en sidopanel som följer
  med när du skrollar, flödet ligger bredvid

## Så pratar appen med API:et

| I appen | Anrop |
| --- | --- |
| Listan laddas | `GET /api/entries` |
| *Save entry* | `POST /api/entries` |
| Vald bild | `POST /api/entries/{id}/photo` (`multipart/form-data`) |
| *Mark as done* | `PUT /api/entries/{id}` |

Bilden laddas upp i ett andra anrop eftersom uppladdningen behöver inläggets id.

## Projektstruktur

```
src/
  api/             client.ts (anrop och felhantering) och entries.ts (endpoints)
  components/      Header, EntryList, EntryCard, NewEntryForm, ErrorMessage
  hooks/           useEntries - inläggen, laddning, fel och sparning
  types/           TypeScript-typer som speglar API:ets modeller
  App.tsx          layout, kopplar ihop hooken med komponenterna
  index.css        design-tokens (färger, spacing, radier)
```

## Tekniska val

**Vite istället för Create React App.** CRA underhålls inte längre. Vite har
snabbare dev-server, mindre konfiguration och är det verktyg React-dokumentationen
pekar på idag.

**TypeScript som speglar backend.** Typerna i `src/types/entry.ts` följer
C#-modellerna i API:et: `DiaryEntry` har `id: number` precis som `int` i
backend, och `EntryRequest` motsvarar API:ets `EntryRequest`, alltså inlägget
utan `id` och `photoUrl` som ägs av servern. Fel i anropen fångas då redan vid
kompilering istället för i webbläsaren.

**Allt mot API:et i `src/api`.** Komponenterna känner inte till url:er eller
HTTP-metoder. `client.ts` har en `request()` som all trafik går genom, och
`entries.ts` har en funktion per endpoint. Ska adressen eller felhanteringen
ändras finns den på ett ställe.

**Felhanteringen på ett ställe.** `request()` gör om både nätverksfel och
felsvar till ett `ApiError` med ett meddelande som går att visa direkt.
Valideringsfel från API:et (`400`) plockas ur svarets `errors`, så att
gränssnittet visar API:ets egen text, till exempel *The Title field is
required.*

**`useEntries` istället för state i `App`.** Hooken äger inläggen, laddningen,
felet och sparningen. `App` blir en layoutkomponent, och `EntryList` och
`EntryCard` tar emot data och callbacks som props. Inget extra bibliotek för
state behövs – appen har en enda resurs, och `useState` plus en hook räcker.

**Fel visas där de uppstår.** Misslyckas listan visas felet med en
*Try again*-knapp i listan. Misslyckas en sparning visas det i formuläret, och
misslyckas en avbockning visas det på just det kortet. Komponenten
`ErrorMessage` återanvänds på alla tre ställena och har `role="alert"`, så att
skärmläsare läser upp felet.

**Ingen optimistisk uppdatering.** Knapparna visar *Saving…* och är inaktiverade
medan anropet pågår, och gränssnittet uppdateras med det API:et svarar med.
Appen visar alltså aldrig ett läge som servern inte har sparat, och dubbelklick
skapar inte två inlägg.

**Bilden kontrolleras redan i webbläsaren.** Filväljaren begränsas till samma
filändelser som API:et tillåter, och filer över 5 MB stoppas direkt. Det sparar
ett anrop som ändå skulle nekas. API:et validerar samma sak igen, eftersom en
klient aldrig är att lita på.

**CSS Modules.** Varje komponent har sin egen `.module.css`. Klassnamnen scopas
automatiskt, så två komponenter kan båda ha en `.title` utan att krocka. Det
kräver inget extra beroende – Vite har stöd för det direkt.

**Design-tokens i `index.css`.** Färger, spacing och radier ligger som
CSS-variabler på `:root`. Komponenterna hårdkodar aldrig en färg, vilket gör att
hela appen kan stilas om från ett ställe.

**Mobile first i CSS.** Grundstilen gäller de minsta skärmarna och media queries
lägger till från `min-width` och uppåt, istället för att skriva över stilar nedåt.

## Status

Lista, lägg till med bild och uppdatera fungerar mot det egna API:et, och
misslyckade anrop visas som felmeddelanden i gränssnittet.

Att ta bort inlägg finns inte i webbappen. Nästa steg är mobilappen, som använder
samma API.
