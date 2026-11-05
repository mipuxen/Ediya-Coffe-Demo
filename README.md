# ☕ Ediya BlueRoad

> **An interactive 3D concept web platform for Ediya Coffee by the Yeongdeok Blue Road.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.150-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Material UI](https://img.shields.io/badge/MUI-5-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 📌 Disclaimer
*This project is an **unofficial concept website** developed as a portfolio piece by **Shukhratbek Khoshimov**. It is not affiliated with or endorsed by Ediya Coffee and does not support commercial transactions or ordering.*

---

## 🌟 Key Features

* **🎨 3D Interactive Hero Scene:** Built using **Three.js**, featuring an automated showcase with a coffee bag, scissors, an illuminated grinder with an EDIYA display, espresso extraction, ice, and a frosted logo glass. Includes interactive playback and stage indicators.
* **🔊 Spatial Sound Experience:** Procedural WebAudio environment generating ambient ocean waves, café soundscapes, grinding, pouring, and glass clinking effects.
* **🥤 Dynamic Menu Catalog:** Features **61 beverages** with real-time category filtering (Iced-only, Zero Sugar, Caffeine-free), sorting, and search functionality.
* **🔍 3D Drink Viewer:** Draggable, interactive 3D cup model for individual beverages with customization options (size, temperature) and taste profile indicators.
* **🗣️ Order Phrase Generator:** Converts cart selections into natural Korean counter ordering sentences *(e.g., "아이스 아메리카노 라지 2잔 주문할게요.")*.
* **👤 My Ediya Dashboard:** Local storage-driven user experience storing favorites, recently viewed items, and order history without requiring account setup.
* **🌐 Multilingual & Responsive:** Complete support for Korean (default), English, and Russian across desktop and mobile bottom navigation.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (Pages Router) |
| **UI Library** | React 18, Material-UI (MUI v5) |
| **Styling** | SCSS / SASS |
| **3D & Audio** | Three.js v0.150, WebAudio API |
| **State Management** | Apollo Reactive Variables (Client-side) |
| **Localization** | `next-i18next` |

---

## 📂 Project Structure

```text
├── pages/                  # Next.js Pages (index, menu, store, mypage, cs, 404)
├── libs/
│   ├── ediya/              # 3D Engines & Logic (heroScene, glassViewer, kit, sound, cart)
│   ├── components/ediya/   # UI Components (Hero, Cart Drawer, Cards, Map, Help)
│   └── data/               # Menu catalog & FAQ content
└── scss/                   # Global brand styling layer
