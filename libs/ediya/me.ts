import { favVar, nickVar, ordersVar, recentVar, SavedOrder } from '../../apollo/store';
import { CartItem } from '../types/menu/menu';
import { cartCount, cartTotal } from './cart';

/** Everything "My Ediya" shows lives in this browser only (no account, no server). **/
const K = { fav: 'ediya-fav', recent: 'ediya-recent', orders: 'ediya-orders', nick: 'ediya-nick' };
const MAX_RECENT = 12;
const MAX_ORDERS = 20;

const read = <T,>(k: string, fb: T): T => {
	try {
		const raw = localStorage.getItem(k);
		return raw ? (JSON.parse(raw) as T) : fb;
	} catch (e) {
		return fb;
	}
};
const write = (k: string, v: unknown) => {
	try {
		localStorage.setItem(k, JSON.stringify(v));
	} catch (e) {}
};

export const loadMe = () => {
	favVar(read<number[]>(K.fav, []));
	recentVar(read<number[]>(K.recent, []));
	ordersVar(read<SavedOrder[]>(K.orders, []));
	nickVar(read<string>(K.nick, ''));
};

export const toggleFav = (id: number): boolean => {
	const cur = favVar();
	const on = !cur.includes(id);
	const next = on ? [id, ...cur] : cur.filter((x) => x !== id);
	favVar(next);
	write(K.fav, next);
	return on;
};

export const pushRecent = (id: number) => {
	const next = [id, ...recentVar().filter((x) => x !== id)].slice(0, MAX_RECENT);
	recentVar(next);
	write(K.recent, next);
};

export const saveOrder = (cart: CartItem[], phrase: string) => {
	if (!cart.length) return;
	const next = [{ at: Date.now(), phrase, total: cartTotal(cart), count: cartCount(cart) }, ...ordersVar()].slice(0, MAX_ORDERS);
	ordersVar(next);
	write(K.orders, next);
};

export const setNick = (n: string) => {
	const v = n.trim().slice(0, 16);
	nickVar(v);
	write(K.nick, v);
};

export const clearMe = () => {
	favVar([]);
	recentVar([]);
	ordersVar([]);
	nickVar('');
	Object.values(K).forEach((k) => {
		try {
			localStorage.removeItem(k);
		} catch (e) {}
	});
};
