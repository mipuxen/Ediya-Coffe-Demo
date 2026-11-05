import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import HikingOutlinedIcon from '@mui/icons-material/HikingOutlined';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import BlueRoadMap from '../../libs/components/ediya/BlueRoadMap';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/* Store details: fill these in to show them on the page (hidden while empty) */
const STORE = { address: '', hours: '', phone: '' };

const StorePage: NextPage = () => {
	const { t } = useTranslation('common');
	const feats = [
		{ icon: <LocalCafeOutlinedIcon />, t: 'store_f1t', d: 'store_f1d' },
		{ icon: <RecordVoiceOverOutlinedIcon />, t: 'store_f2t', d: 'store_f2d' },
		{ icon: <HikingOutlinedIcon />, t: 'store_f3t', d: 'store_f3d' },
	];
	const rows = [
		['Location', STORE.address],
		['hours', STORE.hours],
		['phone', STORE.phone],
	].filter((r) => r[1]);
	return (
		<div id="e-store-page">
			<div className="container e-col">
				<div className={'e-store-intro'}>
					<div className={'e-kick'}>{t('store_k')}</div>
					<h2>{t('store_h')}</h2>
					<p>{t('store_p')}</p>
					{rows.length > 0 && (
						<div className={'e-store-rows'}>
							{rows.map(([k, v]) => (
								<span key={k}>
									<b>{k}</b> {v}
								</span>
							))}
						</div>
					)}
				</div>
				<div className={'e-feats'}>
					{feats.map((f) => (
						<div key={f.t} className={'e-feat'}>
							{f.icon}
							<b>{t(f.t)}</b>
							<p>{t(f.d)}</p>
						</div>
					))}
				</div>
				<BlueRoadMap />
				<div className={'e-store-cta'}>
					<Link href={'/menu'} className={'e-btn ac'}>
						{t('hero_cta_menu')}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(StorePage);
