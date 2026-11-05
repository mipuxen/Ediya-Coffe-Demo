import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import DrinkCard from '../../libs/components/ediya/DrinkCard';
import { CATEGORIES, MENU } from '../../libs/data/menu';
import { MenuCategory } from '../../libs/types/menu/menu';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

type Sort = 'def' | 'low' | 'high';

const MenuList: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [cat, setCat] = useState<MenuCategory | 'all'>('all');
	const [flt, setFlt] = useState({ iced: false, zero: false, decaf: false });
	const [sort, setSort] = useState<Sort>('def');
	const [q, setQ] = useState('');

	/** LIFECYCLES **/
	useEffect(() => {
		const c = router.query.cat as MenuCategory | undefined;
		if (c && CATEGORIES.includes(c)) setCat(c);
	}, [router.query.cat]);

	/** HANDLERS **/
	const pickCat = (c: MenuCategory | 'all') => {
		setCat(c);
		router.replace({ pathname: '/menu', query: c === 'all' ? {} : { cat: c } }, undefined, { shallow: true, scroll: false });
	};

	const list = useMemo(() => {
		const s = q.trim().toLowerCase();
		let l = MENU.filter(
			(m) =>
				(cat === 'all' || m.cat === cat) &&
				(!flt.iced || m.iced) &&
				(!flt.zero || m.zero) &&
				(!flt.decaf || m.caffeine === 0) &&
				(!s || m.ko.includes(s) || m.en.toLowerCase().includes(s)),
		);
		if (sort === 'low') l = [...l].sort((a, b) => a.L - b.L);
		if (sort === 'high') l = [...l].sort((a, b) => b.L - a.L);
		return l;
	}, [cat, flt, sort, q]);

	return (
		<div id="e-menu-page">
			<div className="container e-col">
				<Stack className={'e-toolbar'}>
					<div className={'e-chips'} role="tablist">
						{(['all', ...CATEGORIES] as const).map((c) => (
							<button key={c} role="tab" aria-selected={cat === c} className={`e-chip ${cat === c ? 'on' : ''}`} onClick={() => pickCat(c)}>
								{t(c)}
							</button>
						))}
					</div>
					<div className={'e-toolbar-r'}>
						<label className={'e-search'}>
							<SearchRoundedIcon />
							<input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} aria-label={t('search')} />
						</label>
						<select className={'e-select'} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t('sort')}>
							<option value="def">{t('sort_def')}</option>
							<option value="low">{t('sort_low')}</option>
							<option value="high">{t('sort_high')}</option>
						</select>
					</div>
				</Stack>
				<div className={'e-chips'}>
					{(
						[
							['iced', 'f_iced'],
							['zero', 'f_zero'],
							['decaf', 'f_decaf'],
						] as const
					).map(([k, l]) => (
						<button key={k} aria-pressed={flt[k]} className={`e-chip fl ${flt[k] ? 'on' : ''}`} onClick={() => setFlt({ ...flt, [k]: !flt[k] })}>
							{t(l)}
						</button>
					))}
					<span className={'e-count'}>
						{list.length} {t('count')}
					</span>
				</div>
				{list.length ? (
					<div className={'e-grid'}>
						{list.map((it) => (
							<DrinkCard key={it.id} item={it} />
						))}
					</div>
				) : (
					<div className={'e-empty'}>{t('empty')}</div>
				)}
				<p className={'e-note'}>{t('price_note')}</p>
			</div>
		</div>
	);
};

export default withLayoutBasic(MenuList);
