import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import { MENU, SIGNATURE_IDS } from '../../../data/menu';
import DrinkCard from '../../ediya/DrinkCard';

const SignatureDrinks = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const items = SIGNATURE_IDS.map((id) => MENU[id]);

	return (
		<section className={'e-section'}>
			<div className={'container e-col'}>
				<div className={'e-head'}>
					<div>
						<div className={'e-kick'}>Signature</div>
						<h2>{t('sig_t')}</h2>
						<p>{t('sig_d')}</p>
					</div>
					<Link href={'/menu'} className={'e-more'}>
						{t('see_all')} →
					</Link>
				</div>
				{device === 'mobile' ? (
					<Swiper className={'e-swiper'} slidesPerView={'auto'} spaceBetween={12} freeMode modules={[FreeMode]}>
						{items.map((it) => (
							<SwiperSlide key={it.id} className={'e-slide'}>
								<DrinkCard item={it} />
							</SwiperSlide>
						))}
					</Swiper>
				) : (
					<div className={'e-grid four'}>
						{items.map((it) => (
							<DrinkCard key={it.id} item={it} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default SignatureDrinks;
