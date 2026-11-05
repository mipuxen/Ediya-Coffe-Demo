import React, { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { cartOpenVar, cartVar } from '../../../apollo/store';
import { cartTotal, changeQty, clearCart, koOrder, loadCart, unitPrice } from '../../ediya/cart';
import { fmtWon, getItem } from '../../data/menu';
import { useItemText } from '../../ediya/useItemText';
import { toast } from './Toast';
import { loadMe, saveOrder } from '../../ediya/me';

const CartDrawer = () => {
	const { t } = useTranslation('common');
	const cart = useReactiveVar(cartVar);
	const open = useReactiveVar(cartOpenVar);
	const tx = useItemText();

	useEffect(() => {
		loadCart();
		loadMe();
		const esc = (e: KeyboardEvent) => e.key === 'Escape' && cartOpenVar(false);
		window.addEventListener('keydown', esc);
		return () => window.removeEventListener('keydown', esc);
	}, []);

	const copy = async () => {
		if (!cart.length) return;
		const phrase = koOrder(cart);
		try {
			await navigator.clipboard.writeText(phrase);
		} catch (e) {}
		saveOrder(cart, phrase);
		toast(`${t('copied')} — ${phrase}`);
	};

	return (
		<>
			<div className={`e-scrim ${open ? 'on' : ''}`} onClick={() => cartOpenVar(false)} />
			<aside className={`e-drawer ${open ? 'on' : ''}`} aria-label={t('cart')} aria-hidden={!open}>
				<div className={'e-drawer-head'}>
					<h3>{t('cart')}</h3>
					<button className={'e-icon'} onClick={() => cartOpenVar(false)} aria-label="close">
						<CloseRoundedIcon />
					</button>
				</div>
				<p className={'e-drawer-hint'}>{t('order_hint')}</p>
				<div className={'e-drawer-list'}>
					{!cart.length && <div className={'e-empty'}>{t('empty_cart')}</div>}
					{cart.map((c) => {
						const it = getItem(c.id);
						if (!it) return null;
						return (
							<div className={'e-ci'} key={c.key}>
								<div>
									<b>
										{tx.name(it)}
										{it.variants.length ? ' · ' + tx.vname(it.variants[c.variant]) : ''}
									</b>
									<small>
										{it.cat !== 'sf' ? `${c.size} · ${c.temp === 'hot' ? t('hot') : t('iced')} · ` : ''}
										{c.banana ? '+banana · ' : ''}
										{fmtWon(unitPrice(c))}
									</small>
								</div>
								<div className={'e-qty'}>
									<button onClick={() => changeQty(c.key, -1)} aria-label="-">
										−
									</button>
									<span>{c.qty}</span>
									<button onClick={() => changeQty(c.key, 1)} aria-label="+">
										+
									</button>
								</div>
							</div>
						);
					})}
				</div>
				{cart.length > 0 && <div className={'e-phrase'}>{koOrder(cart)}</div>}
				<div className={'e-total'}>
					<span>{t('total')}</span>
					<span>{fmtWon(cartTotal(cart))}</span>
				</div>
				<button className={'e-btn ac block'} onClick={copy} disabled={!cart.length}>
					{t('copy_order')}
				</button>
				<button className={'e-btn line block'} onClick={clearCart} disabled={!cart.length}>
					{t('clear')}
				</button>
			</aside>
		</>
	);
};

export default CartDrawer;
