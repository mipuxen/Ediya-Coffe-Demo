import { useRouter } from 'next/router';
import { MenuItem, MenuVariant } from '../types/menu/menu';

/* Korean locale shows Korean names first; en/ru show English names first */
export const useItemText = () => {
	const { locale } = useRouter();
	const kr = locale === 'kr';
	return {
		kr,
		name: (it: MenuItem) => (kr ? it.ko : it.en),
		sub: (it: MenuItem) => (kr ? it.en : it.ko),
		desc: (it: MenuItem) => (kr ? it.descKo : it.descEn),
		vname: (v: MenuVariant) => (kr ? v.ko : v.en),
	};
};
