import { cartVar } from '../../apollo/store';
import { CartItem, MenuItem, Size, Temp } from '../types/menu/menu';
import { getItem } from '../data/menu';

const KEY = 'ediya-cart';

export const unitPrice = (c: CartItem) => {
	const it = getItem(c.id);
	if (!it) return 0;
	return (c.size === 'E' && it.E ? it.E : it.L) + (c.banana ? 500 : 0);
};
export const cartCount = (cart: CartItem[]) => cart.reduce((a, c) => a + c.qty, 0);
export const cartTotal = (cart: CartItem[]) => cart.reduce((a, c) => a + unitPrice(c) * c.qty, 0);

const save = (cart: CartItem[]) => {
	cartVar(cart);
	try {
		localStorage.setItem(KEY, JSON.stringify(cart));
	} catch (e) {}
};

export const loadCart = () => {
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) cartVar(JSON.parse(raw));
	} catch (e) {}
};

export const addToCart = (it: MenuItem, o: { variant: number; size: Size; temp: Temp; banana: boolean }) => {
	const key = [it.id, o.variant, o.size, o.temp, o.banana].join('|');
	const cart = [...cartVar()];
	const f = cart.find((c) => c.key === key);
	if (f) f.qty++;
	else cart.push({ key, id: it.id, variant: o.variant, size: o.size, temp: o.temp, banana: o.banana, qty: 1 });
	save(cart.map((c) => ({ ...c })));
};

export const changeQty = (key: string, d: number) => {
	const cart = cartVar()
		.map((c) => (c.key === key ? { ...c, qty: c.qty + d } : c))
		.filter((c) => c.qty > 0);
	save(cart);
};

export const clearCart = () => save([]);

/* The phrase a customer can show or read at the counter, e.g. "아이스 아메리카노 라지 2잔 주문할게요." */
const cname = (it: MenuItem, v: number) => {
	const base = it.ko.replace(/\s*\(.*\)/, '');
	if (it.variants.length && it.ko === '티 (5종)') return it.variants[v].ko;
	return it.variants.length ? `${it.variants[v].ko} ${base}` : base;
};
export const koOrder = (cart: CartItem[]) =>
	cart
		.map((c) => {
			const it = getItem(c.id)!;
			let t = cname(it, c.variant);
			if (it.hotOk && !/^아이스|뱅쇼|차$/.test(t)) t = (c.temp === 'hot' ? '핫 ' : '아이스 ') + t;
			else if (it.hotOk && c.temp === 'hot' && !/^핫/.test(t)) t = '핫 ' + t;
			if (it.cat !== 'sf' && it.E) t += ' ' + (c.size === 'E' ? '엑스트라' : '라지');
			if (c.banana) t += ' 바나나믹스 추가';
			return `${t} ${c.qty}${it.cat === 'sf' ? '개' : '잔'}`;
		})
		.join(', ') + ' 주문할게요.';
