import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { favVar, nickVar, ordersVar, recentVar } from '../../../apollo/store';
import { clearMe, loadMe, setNick } from '../../ediya/me';
import { getItem, fmtWon } from '../../data/menu';
import { MenuItem } from '../../types/menu/menu';
import DrinkCard from './DrinkCard';
import { toast } from './Toast';

type Tab = 'fav' | 'recent' | 'orders' | 'settings';
const TABS: Tab[] = ['fav', 'recent', 'orders', 'settings'];

const pick = (ids: number[]) => ids.map((i) => getItem(i)).filter(Boolean) as MenuItem[];

const MyEdiya = () => {
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const fav = useReactiveVar(favVar);
	const recent = useReactiveVar(recentVar);
	const orders = useReactiveVar(ordersVar);
	const nick = useReactiveVar(nickVar);
	const [draft, setDraft] = useState('');
	const tab = (TABS.includes(router.query.tab as Tab) ? router.query.tab : 'fav') as Tab;

	useEffect(() => {
		loadMe();
	}, []);
	useEffect(() => setDraft(nick), [nick]);

	const go = (next: Tab) => router.replace({ pathname: '/mypage', query: { tab: next } }, undefined, { shallow: true, scroll: false });
	const counts: Record<Tab, number | null> = { fav: fav.length, recent: recent.length, orders: orders.length, settings: null };
	const fmtDate = (at: number) =>
		new Date(at).toLocaleString(i18n.language === 'kr' ? 'ko-KR' : i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});

	const grid = (items: MenuItem[], empty: string) =>
		items.length ? (
			<div className={'e-grid'}>
				{items.map((m) => (
					<DrinkCard key={m.id} item={m} />
				))}
			</div>
		) : (
			<div className={'e-empty'}>
				{empty}
				<Link href={'/menu'} className={'e-more'}>
					{t('go_menu')}
				</Link>
			</div>
		);

	return (
		<div id="e-my-page">
			<div className="container e-col">
				<div className={'e-my-head'}>
					<div className={'e-my-avatar'} aria-hidden="true">
						{(nick || 'E').slice(0, 1).toUpperCase()}
					</div>
					<div>
						<h2>{nick ? t('my_hello', { nick }) : t('my_guest')}</h2>
						<p>{t('my_local')}</p>
					</div>
				</div>

				<div className={'e-tabs'} role="tablist">
					{TABS.map((k) => (
						<button key={k} role="tab" aria-selected={tab === k} className={`e-tab ${tab === k ? 'on' : ''}`} onClick={() => go(k)}>
							{t(`my_${k}`)}
							{counts[k] !== null && <em>{counts[k]}</em>}
						</button>
					))}
				</div>

				{tab === 'fav' && grid(pick(fav), t('my_fav_empty'))}
				{tab === 'recent' && grid(pick(recent), t('my_recent_empty'))}

				{tab === 'orders' &&
					(orders.length ? (
						<div className={'e-orders'}>
							{orders.map((o) => (
								<div className={'e-order'} key={o.at}>
									<time>{fmtDate(o.at)}</time>
									<p>{o.phrase}</p>
									<span>
										{o.count}
										{t('items')} · {fmtWon(o.total)}
									</span>
								</div>
							))}
						</div>
					) : (
						<div className={'e-empty'}>
							{t('my_orders_empty')}
							<Link href={'/menu'} className={'e-more'}>
								{t('go_menu')}
							</Link>
						</div>
					))}

				{tab === 'settings' && (
					<div className={'e-settings'}>
						<label htmlFor="e-nick">{t('my_nick')}</label>
						<div className={'e-nick-row'}>
							<input id="e-nick" value={draft} maxLength={16} onChange={(e) => setDraft(e.target.value)} placeholder={t('my_nick_ph')} />
							<button
								className={'e-btn ac'}
								onClick={() => {
									setNick(draft);
									toast(t('my_saved'));
								}}
							>
								{t('save')}
							</button>
						</div>
						<p className={'e-note'}>{t('my_local_note')}</p>
						<button
							className={'e-btn line danger'}
							onClick={() => {
								if (window.confirm(t('my_clear_confirm'))) {
									clearMe();
									toast(t('my_cleared'));
								}
							}}
						>
							{t('my_clear')}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyEdiya;
