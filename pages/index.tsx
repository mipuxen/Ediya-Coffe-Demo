import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import SignatureDrinks from '../libs/components/homepage/ediya/SignatureDrinks';
import CategoryShowcase from '../libs/components/homepage/ediya/CategoryShowcase';
import StorySteps from '../libs/components/homepage/ediya/StorySteps';
import BlueRoadMap from '../libs/components/ediya/BlueRoadMap';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	return (
		<Stack className={'home-page e-home'}>
			<SignatureDrinks />
			<CategoryShowcase />
			<StorySteps />
			<section className={'e-section'}>
				<div className={'container e-col'}>
					<BlueRoadMap />
				</div>
			</section>
		</Stack>
	);
};

export default withLayoutMain(Home);
