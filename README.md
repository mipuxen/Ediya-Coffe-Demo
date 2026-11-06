# Ediya BlueRoad

[한국어](./README.ko.md)

An unofficial concept website for an Ediya Coffee store near the Yeongdeok Blue Road, built as a portfolio piece by Khoshimov Shukhratbek. It is **not** the official Ediya website and has no ordering or payment.

## The idea
Customers who don't speak much Korean often freeze at the counter. The site turns browsing into something they can use there: pick drinks, and the cart becomes a ready-to-say Korean sentence such as *"아이스 아메리카노 라지 2잔 주문할게요."* The home page tells the story of a drink (bag → grinder → ice → espresso → water → finished glass) as a real-time 3D animation that plays on its own.

## Features
- **Autoplay 3D hero** (three.js): bag and scissors, a grinder with an EDIYA COFFEE screen, ice, espresso and water, ending on a glass with a frosted logo. Pause, replay and 5 stage chips; no scrolling needed.
- **Sound button**: procedural WebAudio (sea and café ambience plus grinder, pour and clink effects that follow the animation). Silent until pressed.
- **Menu**: 61 drinks, category chips, filters (iced-only, zero sugar, caffeine-free), sort and search.
- **Drink detail**: draggable 3D glass, size / temperature / options, taste bars, related drinks.
- **Cart → order phrase**: copy a Korean counter sentence.
- **My Ediya**: favourites, recently viewed, order history and a nickname. No account; stored in the browser (localStorage).
- **Help**: guide and FAQ. **Store / Blue Road**: concept page with an SVG course map.
- **Video hero**: if you add a hero video (see below) it plays instead of the 3D scene, with the same captions, stage chips, pause and replay. Without a video, the 3D animation plays.
- Korean (default), English, Russian. Desktop and mobile layouts (bottom tab bar on phones).

## Decisions
- **Started from the Nestar Next.js template**, then removed its real-estate and backend features (they needed an API that doesn't exist) and replaced them with client-side equivalents. About 18% of the code is still unchanged template code (layout wrappers, theme, i18n setup); the visible UI is new.
- **No backend for now.** Everything runs in the browser, so the site deploys as static pages. A NestJS API (accounts, community board) is planned.
- **The hero always autoplays**, even when the visitor has "reduce motion" enabled, because the animation is the point of the page. The pause button is always available and the extra camera sway is dropped in that case.

## Problems solved
- Autoplay without scrolling, and a smooth, silent-by-default sound button (all gains are ramped; the audio context starts only on a click).
- Keeping three.js out of the first-load bundle (home page 310 kB → 194 kB).
- Mobile page was zoomed out by a global `white-space: nowrap` stretching grids; fixed at the source.
- Removing ~99 unused assets (76 MB → 140 KB) and ~50 unused packages.

## Stack
Next.js 14 (Pages Router) · React 18 · MUI 5 · SCSS · three.js 0.150 · Apollo reactive vars (client state only) · next-i18next · TypeScript 5.

## Run
```bash
yarn install
yarn dev          # http://localhost:3000
yarn build && yarn start
```
Deploy: import the repository in Vercel (framework preset: Next.js). No environment variables are needed.

## Using a generated hero video
Put the files in `public/video/` and redeploy. The home hero uses the video automatically; with no file it falls back to the 3D animation.
- `story-wide.mp4`: 16:9, used on desktop and tablets
- `story-vertical.mp4`: 9:16, used on phones

Either one is enough; the other acts as a fallback. The stage captions and chips are mapped onto the video's timeline (bag 0%, grinder 22%, ice + espresso 50%, water 70%, finished glass 88%; see `STAGES` in `libs/ediya/constants.ts`), so make the video follow that story, or edit those numbers to match it. Use H.264 MP4 without audio, a 10 to 16 second loop under ~5 MB each:
```bash
ffmpeg -i input.mp4 -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart story-wide.mp4
```
It plays muted on a loop, pauses when scrolled off-screen, and shows a play button if the browser blocks autoplay.

## Project layout
- `pages/`: index, menu, menu/detail, store, mypage, cs, 404
- `libs/ediya/`: 3D scenes (`heroScene.ts`, `glassViewer.ts`, `kit.ts`), `sound.ts`, `cart.ts`, `me.ts`
- `libs/components/ediya/`: hero (video or 3D), cart drawer, cards, map, My Ediya, Help
- `libs/data/`: menu (61 drinks) and help content
- `scss/ediya.scss`: the brand layer

## Notes
- Store address, hours and phone are empty on purpose (`pages/store/index.tsx`) and hidden until filled in.
- Taste descriptions are general introductions, not the real recipes. Prices follow the in-store menu board and may change.
