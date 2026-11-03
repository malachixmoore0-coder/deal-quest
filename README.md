# Deal Quest

A nine-level BRRRR real estate course for first-time investors in New York's Capital Region. It includes lessons, section quizzes, boss-fight chapter tests, practice games, flashcards, and deal calculators.

## Run it

Requires Node.js 22 or newer.

```bash
npm install
npm start
```

## Build the phone apps

The project uses [Capacitor](https://capacitorjs.com/) to wrap the web app for Android and iOS.

```bash
npx cap add android
npm run android
```

This opens Android Studio. For iOS, you need a Mac with Xcode:

```bash
npx cap add ios
npm run ios
```

Before release, replace `com.malachi.dealquest` in `capacitor.config.json` if you want a different app ID.

## Where things live

| Path | Contents |
| --- | --- |
| `src/c1.js`, `c2.js`, `c3.js` | Course lessons, quizzes, and tests |
| `src/extra.js` | Sample deal, terms, numbers, sources, and rehab prices |
| `src/app.js` | Core views and deal calculators |
| `src/quest.js` | Map, XP, boss fights, and practice games |
| `src/quest.css`, `shell.html` | Visual design and page shell |
| `public/media/` | Videos and poster images |
| `scripts/build.mjs` | Combines everything into `dist/` |

The game layer intentionally overrides some functions in `app.js`, so `quest.js` must load last. The build handles this.

## Videos

`public/media` contains 4K (2160×3840) and 1080p H.264 versions of each animation. The app loads 4K only on screens that can show the extra detail. The 4K files are AI-upscaled from 720p sources.

## Progress

Progress and saved deals are stored locally on the device. There are no accounts or cross-device sync yet.

## Before you publish

- Rates, laws, and local rules were checked in November 2026. Review them regularly.
- Rehab prices and many closing costs are planning estimates, not local quotes.
- Have a New York real estate attorney review the legal content before charging for or widely distributing the course.
- The content is education only, and it isn't legal, tax, or financial advice.
