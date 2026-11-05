import { makeVar } from '@apollo/client';
import { CartItem } from '../libs/types/menu/menu';

/** Client-only state. Cart, favourites, history and nickname persist to localStorage (libs/ediya/*). **/
export const cartVar = makeVar<CartItem[]>([]);
export const cartOpenVar = makeVar<boolean>(false);
export const soundOnVar = makeVar<boolean>(false);

export interface SavedOrder {
	at: number;
	phrase: string;
	total: number;
	count: number;
}
export const favVar = makeVar<number[]>([]);
export const recentVar = makeVar<number[]>([]);
export const ordersVar = makeVar<SavedOrder[]>([]);
export const nickVar = makeVar<string>('');
