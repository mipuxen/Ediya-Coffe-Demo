# Ediya BlueRoad

Unofficial concept website for an Ediya Coffee store near the Yeongdeok Blue Road, built as a portfolio piece by Khoshimov Shukhratbek. It is **not** the official Ediya website and has no ordering or payment.

Started from the Nestar Next.js template; the real-estate / backend features were removed and replaced.

## What it has
- **Home**: a hero that autoplays (no scrolling) in real three.js: bag, scissors, grinder with an EDIYA COFFEE screen, ice, espresso, water, finished glass with a frosted logo. Play/pause, replay, 5 stage chips.
- **Sound button**: procedural WebAudio (sea/café ambience + grinder, pour, clink effects). Silent until pressed.
- **Menu**: 61 drinks, category chips, filters (iced-only / zero sugar / caffeine-free), sort, search.
- **Drink detail**: draggable 3D glass, size / temperature / options, taste bars, related drinks.
- **Cart -> order phrase**: turns the cart into a Korean counter sentence ("아이스 아메리카노 라지 2잔 주문할게요.").
- **My Ediya**: favourites, recently viewed, order history, nickname. No account; stored in the browser only (localStorage).
- **Help**: guide + FAQ. **Store / Blue Road**: concept page with an SVG course map.
- Korean (default), English, Russian. Desktop and mobile (bottom tab bar).

## Stack
Next.js 14 (Pages Router) · React 18 · MUI 5 · SCSS · three.js 0.150 · Apollo reactive vars (client state only) · next-i18next.

## Run
```bash
yarn install
yarn dev      # http://localhost:3000
yarn build && yarn start
```

## Layout
- `pages/` index, menu, menu/detail, store, mypage, cs, 404
- `libs/ediya/` 3D scenes (`heroScene.ts`, `glassViewer.ts`, `kit.ts`), `sound.ts`, `cart.ts`, `me.ts`
- `libs/components/ediya/` hero, cart drawer, cards, map, My Ediya, Help
- `libs/data/` menu (61 drinks) and help content
- `scss/ediya.scss` brand layer

## Notes
- Store address, hours and phone are intentionally empty (`pages/store/index.tsx`) and hidden until filled in.
- Taste descriptions are general introductions, not the real recipes. Prices follow the in-store menu board and may change.
# Ediya-Coffe-Demo
