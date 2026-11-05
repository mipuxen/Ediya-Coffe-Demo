import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			const NAVY = 'linear-gradient(120deg,#06131f 0%,#0b2b47 55%,#0f4468 100%)';
			bgImage = NAVY;
			switch (router.pathname) {
				case '/menu':
					title = 'menu_banner_t';
					desc = 'menu_banner_d';
					break;
				case '/menu/detail':
					title = 'detail_banner_t';
					desc = 'detail_banner_d';
					break;
				case '/store':
					title = 'store_banner_t';
					desc = 'store_banner_d';
					bgImage = 'linear-gradient(120deg,#0b2b47 0%,#0f4a72 60%,#1a6d9c 100%)';
					break;
				case '/mypage':
					title = 'my_banner_t';
					desc = 'my_banner_d';
					break;
				case '/cs':
					title = 'help_banner_t';
					desc = 'cs_banner_d';
					break;
				case '/404':
					title = '404';
					desc = 'nf_text';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>{`${t(memoizedValues.title)} · Ediya Coffee 블루로드점`}</title>
						<meta name={'title'} content={`Ediya Coffee 블루로드점`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'e-banner mobile'} style={{ backgroundImage: memoizedValues.bgImage }}>
							<strong>{t(memoizedValues.title)}</strong>
							<span>{t(memoizedValues.desc)}</span>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>{`${t(memoizedValues.title)} · Ediya Coffee 블루로드점`}</title>
						<meta name={'title'} content={`Ediya Coffee 블루로드점`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={'header-basic e-banner'}
							style={{ backgroundImage: memoizedValues.bgImage }}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
