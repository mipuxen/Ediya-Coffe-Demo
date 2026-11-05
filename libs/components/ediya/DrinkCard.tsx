import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { MenuItem } from '../../types/menu/menu';
import { fmtWon } from '../../data/menu';
import { glassSvg } from '../../ediya/glassSvg';
import { useItemText } from '../../ediya/useItemText';
import { addToCart } from '../../ediya/cart';
import { useReactiveVar } from '@apollo/client';
import { favVar } from '../../../apollo/store';
import { toggleFav } from '../../ediya/me';
import { AU } from '../../ediya/sound';
import { toast } from './Toast';

const DrinkCard = ({ item }: { item: MenuItem }) => {
	const { t } = useTranslation('common');
	const tx = useItemText();
	const favs = useReactiveVar(favVar);
	const fav = favs.includes(item.id);
	const svg = useMemo(() => glassSvg(item, { height: 130, hot: item.hotDefault }), [item]);
	const quickAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		addToCart(item, { variant: 0, size: 'L', temp: item.hotDefault && item.hotOk ? 'hot' : 'ice', banana: false });
		AU.fx('add');
		toast(`${tx.name(item)} — ${t('added')}`);
	};
	const heart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleFav(item.id);
	};
	return (
		<Link href={`/menu/detail?id=${item.id}`} className={'e-card'}>
			{item.iced && <span className={'e-badge ice'}>❄ ICED</span>}
			{item.zero && <span className={'e-badge zero'}>ZERO</span>}
			<button className={`e-fav ${fav ? 'on' : ''}`} onClick={heart} aria-pressed={fav} aria-label={t('fav')}>
				{fav ? '♥' : '♡'}
			</button>
			<div className={'e-card-glass'} dangerouslySetInnerHTML={{ __html: svg }} />
			<strong>{tx.name(item)}</strong>
			<small>{tx.sub(item)}</small>
			<div className={'e-card-foot'}>
				<span className={'e-price'}>
					{fmtWon(item.L)}
					{item.E ? <em> · {fmtWon(item.E)}</em> : null}
				</span>
				<button className={'e-add'} onClick={quickAdd} aria-label={t('add')}>
					+
				</button>
			</div>
		</Link>
	);
};

export default DrinkCard;
