/* Lightweight SVG glass for menu cards (no WebGL needed) */
import { MenuItem } from '../types/menu/menu';

let n = 0;
export function glassSvg(it: MenuItem, o: { height?: number; hot?: boolean; logo?: boolean } = {}) {
	const id = 'g' + n++;
	const c1 = it.c1,
		c2 = it.c2 || it.c1,
		sf = it.cat === 'sf';
	const ice = !sf && !o.hot;
	const H = o.height || 150;
	let b = '';
	if (sf) {
		b = `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
    <path d="M26 100 L94 100 L84 150 Q82 156 76 156 L44 156 Q38 156 36 150Z" fill="#ffffff22" stroke="#ffffff88" stroke-width="2"/>
    <path d="M30 100 Q60 112 90 100 L84 148 Q82 154 76 154 L44 154 Q38 154 36 148Z" fill="${c1}"/>
    <path d="M28 100 Q22 82 40 78 Q34 60 52 56 Q50 38 62 28 Q72 44 70 56 Q88 62 82 78 Q100 82 92 100Q60 110 28 100Z" fill="url(#${id})" stroke="#ccd3da"/>
    ${it.c2 ? `<path d="M38 88 Q60 96 84 86 M44 70 Q62 76 78 68" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>` : ''}`;
	} else {
		const cream =
			it.top === 'c'
				? `<path d="M24 34 Q22 12 44 10 Q48 -2 62 4 Q84 0 88 14 Q100 20 96 34Z" fill="#fff" stroke="#ddd"/>`
				: it.top === 'f'
				? `<path d="M22 36 Q24 10 60 12 Q96 10 98 36Z" fill="#fff6e6" stroke="#e7d6bd"/>`
				: '';
		b = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <clipPath id="${id}c"><path d="M22 34 L98 34 L90 160 Q89 164 85 164 L35 164 Q31 164 30 160Z"/></clipPath></defs>
    <path d="M22 34 L98 34 L90 160 Q89 164 85 164 L35 164 Q31 164 30 160Z" fill="#ffffff1c" stroke="#9fb6c8" stroke-width="2"/>
    <g clip-path="url(#${id}c)"><rect x="10" y="54" width="100" height="120" fill="url(#${id})"/>
    ${it.c2 && it.c2 !== it.c1 ? `<path d="M20 90 Q40 80 52 100 T84 96 T110 110 V170 H20Z" fill="${c2}" opacity=".55"/>` : ''}
    ${ice ? `<g fill="#e4f3ff" fill-opacity=".55" stroke="#fff" stroke-opacity=".6"><rect x="34" y="58" width="22" height="22" rx="4" transform="rotate(12 45 69)"/><rect x="62" y="64" width="22" height="22" rx="4" transform="rotate(-14 73 75)"/><rect x="44" y="92" width="22" height="22" rx="4" transform="rotate(8 55 103)"/></g>` : ''}
    <rect x="30" y="34" width="8" height="130" fill="#fff" opacity=".18"/>
    ${o.logo ? `<text x="60" y="112" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="11" fill="#fff" fill-opacity=".6">EDIYA</text><text x="60" y="125" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="11" fill="#fff" fill-opacity=".6">COFFEE</text>` : ''}</g>${cream}
    ${ice ? `<line x1="70" y1="30" x2="82" y2="-8" stroke="#4ec3ff" stroke-width="6" stroke-linecap="round"/>` : ''}
    ${o.hot ? `<g stroke="#9fb6c8" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"><path d="M44 24 Q38 14 46 6 Q52 -2 44 -10"/><path d="M68 24 Q62 14 70 6 Q76 -2 68 -10"/></g>` : ''}`;
	}
	return `<svg viewBox="0 -14 120 184" height="${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${b}</svg>`;
}
