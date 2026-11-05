import React from 'react';
import { useTranslation } from 'next-i18next';

/* the hero story as a static recap, for people who scrolled straight past it */
const StorySteps = () => {
	const { t } = useTranslation('common');
	const steps = ['s1', 's2', 's3', 's4', 's5'];
	return (
		<section className={'e-section'}>
			<div className={'container e-col'}>
				<div className={'e-head'}>
					<div>
						<div className={'e-kick'}>Iced Americano · 3,200원</div>
						<h2>{t('hero_s5_h')}</h2>
					</div>
				</div>
				<ol className={'e-steps'}>
					{steps.map((s) => (
						<li key={s}>
							<small>{t(`hero_${s}_k`)}</small>
							<b>{t(`hero_${s}_h`)}</b>
							<p>{t(`hero_${s}_p`)}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
};

export default StorySteps;
