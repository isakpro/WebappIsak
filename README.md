# Pawlog – webbapp

En dagbok för hunden. Varje dag lägger du upp en bild, en kort rubrik, en
berättelse om vad hunden gjorde och ett träningsmål som du kan bocka av när det
sitter.

Det här repot innehåller **webbappen** (React). Den är en av tre delar i
plattformen:

| Del | Teknik | Repo |
| --- | --- | --- |
| Webbapp | React + TypeScript | det här repot |
| Backend / API | ASP.NET WebAPI | kommer |
| Mobilapp | React Native (Expo) | kommer |

## Kom igång

### Förutsättningar

- [Node.js](https://nodejs.org/) 20.19 eller senare (Vite 8 kräver det)
- npm (följer med Node)

Kontrollera att du har rätt version:

```bash
node -v
```

### Starta webbappen

```bash
git clone https://github.com/isakpro/WebappIsak.git
cd WebappIsak
npm install
npm run dev
```

Öppna sedan **http://localhost:5173** i webbläsaren. Vite startar med hot reload,
så ändringar i koden syns direkt utan omstart.

Vill du stoppa servern trycker du `Ctrl + C` i terminalen.

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

## Projektstruktur

```
src/
  components/      Header, EntryCard, EntryList, NewEntryForm
  data/            exempeldata tills API:et är på plats
  types/           TypeScript-typer för ett dagboksinlägg
  App.tsx          håller state och binder ihop komponenterna
  index.css        design-tokens (färger, spacing, radier)
```

## Tekniska val

**Vite istället för Create React App.** CRA underhålls inte längre. Vite har
snabbare dev-server, mindre konfiguration och är det verktyg React-dokumentationen
pekar på idag.

**TypeScript.** Ett dagboksinlägg har en tydlig form (`DiaryEntry` i
`src/types/entry.ts`). När API:et kopplas på kan samma typ spegla C#-modellen i
backend, så att fel i API-anropen fångas redan vid kompilering istället för i
webbläsaren.

**CSS Modules.** Varje komponent har sin egen `.module.css`. Klassnamnen scopas
automatiskt, så två komponenter kan båda ha en `.title` utan att krocka. Det
kräver inget extra beroende – Vite har stöd för det direkt.

**Design-tokens i `index.css`.** Färger, spacing och radier ligger som
CSS-variabler på `:root`. Komponenterna hårdkodar aldrig en färg, vilket gör att
hela appen kan stilas om från ett ställe.

**State i `App.tsx`.** Listan av inlägg ägs av `App`. `EntryList` och `EntryCard`
tar emot data och callbacks som props och är därmed rena presentationskomponenter
som går att återanvända och testa var för sig.

**Mobile first i CSS.** Grundstilen gäller de minsta skärmarna och media queries
lägger till från `min-width` och uppåt, istället för att skriva över stilar nedåt.

## Status

Just nu körs inläggen mot lokal state med exempeldata, och vald bild visas via
`URL.createObjectURL`. Nästa steg är backend-repot: då byts exempeldatan mot
GET/POST/PUT mot det egna ASP.NET-API:et, bilden laddas upp dit, och ett
felmeddelande visas i gränssnittet om ett anrop misslyckas.
