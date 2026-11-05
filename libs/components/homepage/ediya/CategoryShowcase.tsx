import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { CATEGORIES, MENU } from '../../../data/menu';
import { glassSvg } from '../../../ediya/glassSvg';

/* one tile per menu category, each with the glass of its first drink */
const PICK: Record<string, number> = { cf: 0, nc: 24, bl: 39, jt: 45, sf: 58 };

const CategoryShowcase = () => {
	const { t } = useTranslation('common');
	return (
		<section className={'e-section alt'}>
			<div className={'container e-col'}>
				<div className={'e-head'}>
					<div>
						<div className={'e-kick'}>Menu</div>
						<h2>{t('cat_t')}</h2>
					</div>
				</div>
				<div className={'e-cats'}>
					{CATEGORIES.map((c) => {
						const n = MENU.filter((m) => m.cat === c).length;
						return (
							<Link key={c} href={`/menu?cat=${c}`} className={'e-cat'}>
								<span className={'e-cat-glass'} dangerouslySetInnerHTML={{ __html: glassSvg(MENU[PICK[c]], { height: 96 }) }} />
								<b>{t(c)}</b>
								<small>
									{n} {t('items')}
								</small>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default CategoryShowcase;
