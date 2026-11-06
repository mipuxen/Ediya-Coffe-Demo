<div align="center">

# Ediya BlueRoad

**A coffee-shop website that helps non-Korean speakers order at the counter.**

[Live demo](https://ediya-coffe-demo.vercel.app) · [한국어](./README.ko.md)

![Next.js](https://img.shields.io/badge/Next.js_14-000?logo=nextdotjs&logoColor=fff)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![three.js](https://img.shields.io/badge/three.js-000?logo=threedotjs&logoColor=fff)
![MUI](https://img.shields.io/badge/MUI_5-007FFF?logo=mui&logoColor=fff)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000?logo=vercel&logoColor=fff)

<img src="docs/screenshots/hero-desktop.png" alt="Home hero with the iced Americano video" width="820">

</div>

> **Unofficial concept project.** Built by a barista at an Ediya Coffee store in Yeongdeok, South Korea, as a portfolio piece. It is not the official Ediya website and has no ordering or payment.

## The problem
Visitors to a small coastal town often don't speak much Korean. At a café counter they know what they want but not how to say it.

## The solution
Browse the menu on your phone, add drinks to a cart, and the cart turns into a sentence you can read out or show at the counter:

> **아이스 아메리카노 라지 2잔 주문할게요.**
> *(Two large iced Americanos, please.)*

## Features
- **Video hero**: a vertical, AI-generated video of one iced Americano being made (beans → grinder → ice → water → espresso → finished glass).
- **Menu**: 61 drinks with category chips, filters (iced-only, zero sugar, caffeine-free), sorting and search.
- **Drink detail**: a draggable 3D glass (three.js), size / temperature / options and taste bars.
- **Cart → order phrase**: copy the Korean sentence for the counter.
- **My Ediya**: favourites, recently viewed and order history, saved in the browser. No account needed.
- **Korean, English and Russian**, with separate desktop and mobile layouts.

## Tech stack
| Area | Choice |
|---|---|
| Framework | Next.js 14 (Pages Router), React 18, TypeScript |
| UI | MUI 5 + SCSS |
| 3D | three.js (drink detail glass) |
| State | Apollo Client reactive variables + `localStorage` |
| i18n | next-i18next (kr / en / ru) |
| Hosting | Vercel |

## Getting started
```bash
git clone https://github.com/mipuxen/Ediya-Coffe-Demo.git
cd Ediya-Coffe-Demo
yarn install
yarn dev            # http://localhost:3000
```

## Project structure
```
pages/                  index, menu, menu/detail, store, mypage, cs, 404
libs/ediya/             heroScene.ts (hero video), glassViewer.ts, sound.ts, cart.ts, me.ts
libs/components/ediya/  hero, cart drawer, drink card, map, My Ediya, Help
libs/data/              menu.ts, help.ts
public/video/           hero video
scss/ediya.scss         brand styles
```

## Notes
- Prices follow the in-store menu board and may change; taste descriptions are general, not real recipes.
- Started from the open-source Nestar Next.js template; its real-estate and backend features were removed.

## Author
**Khoshimov Shukhratbek**: [GitHub @mipuxen](https://github.com/mipuxen)
