import { NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const NotFound: NextPage = () => {
	const { t } = useTranslation('common');
	return (
		<div id="e-404">
			<div className="container e-col">
				<div className={'e-empty'}>
					<strong>404</strong>
					{t('nf_text')}
					<Link href={'/'} className={'e-more'}>
						{t('nf_home')}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default withLayoutBasic(NotFound);
