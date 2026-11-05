export type MenuCategory = 'cf' | 'nc' | 'bl' | 'jt' | 'sf';

export interface MenuVariant {
	ko: string;
	en: string;
}

export interface MenuItem {
	id: number;
	cat: MenuCategory;
	ko: string;
	en: string;
	L: number;
	E: number | null;
	sweet: number;
	bitter: number;
	caffeine: number;
	c1: string;
	c2: string;
	top: 'n' | 'c' | 'f';
	variants: MenuVariant[];
	descKo: string;
	descEn: string;
	descUz: string;
	iced: boolean;
	zero: boolean;
	milk: boolean;
	fruit: boolean;
	hotDefault: boolean;
	hotOk: boolean;
}

export type Size = 'L' | 'E';
export type Temp = 'ice' | 'hot';

export interface CartItem {
	key: string;
	id: number;
	variant: number;
	size: Size;
	temp: Temp;
	banana: boolean;
	qty: number;
}
