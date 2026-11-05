import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { cartOpenVar, cartVar, favVar } from '../../apollo/store';
import SoundButton from './ediya/SoundButton';
import CartDrawer from './ediya/CartDrawer';
import Toast from './ediya/Toast';
import { cartCount } from '../ediya/cart';
import { loadMe } from '../ediya/me';

const LINKS = [
	{ href: '/', key: 'Home', icon: <HomeOutlinedIcon /> },
	{ href: '/menu', key: 'Menu', icon: <LocalCafeOutlinedIcon /> },
	{ href: '/store', key: 'Store', icon: <WavesOutlinedIcon /> },
	{ href: '/mypage', key: 'My Page', icon: <FavoriteBorderRoundedIcon /> },
	{ href: '/cs', key: 'CS', icon: <HelpOutlineRoundedIcon /> },
];

const Logo = () => (
	<Link href={'/'} className={'e-logo'} aria-label="Ediya Coffee 블루로드점">
		<span className={'e-logo-mark'} aria-hidden="true">
			<svg viewBox="0 0 32 32" width="30" height="30">
				<rect x="1" y="1" width="30" height="30" rx="9" fill="#0f4a72" />
				<path d="M6 19c3-3 6 3 10 0s7-3 10 0" stroke="#7fd0ff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
				<path d="M6 13c3-3 6 3 10 0s7-3 10 0" stroke="#ffb36b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
			</svg>
		</span>
		<span className={'e-logo-text'}>
			Ediya Coffee <b>블루로드점</b>
		</span>
	</Link>
);

const Top = () => {
	const device = useDeviceDetect();
	const cart = useReactiveVar(cartVar);
	const favs = useReactiveVar(favVar);
	const { t } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('kr');
	const drop = Boolean(anchorEl2);
	const [solid, setSolid] = useState(false);
	const count = cartCount(cart);
	const overHero = router.pathname === '/';

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'kr');
			setLang('kr');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		loadMe();
		const onScroll = () => setSolid(window.scrollY >= 40);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	/** HANDLERS **/
	const langChoice = useCallback(
		async (e: any) => {
			const id = e.currentTarget.id;
			setLang(id);
			localStorage.setItem('locale', id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: id });
		},
		[router],
	);
	const isActive = (href: string) => (href === '/' ? router.pathname === '/' : router.pathname.startsWith(href.split('?')[0]));

	const cartButton = (
		<button className={'e-cart-btn'} onClick={() => cartOpenVar(true)} aria-label={t('cart')}>
			<ShoppingBagOutlinedIcon />
			{count > 0 && <em>{count}</em>}
		</button>
	);

	if (device == 'mobile') {
		return (
			<>
				<Stack className={`e-mtop ${solid || !overHero ? 'solid' : ''}`}>
					<Logo />
					<Box component={'div'} className={'e-mtop-r'}>
						<SoundButton compact />
						{cartButton}
					</Box>
				</Stack>
				<nav className={'e-tabbar'} aria-label="Main">
					{LINKS.map((l) => (
						<Link key={l.href} href={l.href} className={isActive(l.href) ? 'on' : ''}>
							{l.icon}
							<span>{t(l.key)}</span>
						</Link>
					))}
				</nav>
				<CartDrawer />
				<Toast />
			</>
		);
	}

	return (
		<Stack className={`e-nav ${solid || !overHero ? 'solid' : ''}`}>
			<Stack className={'container'}>
				<Logo />
				<Box component={'nav'} className={'e-nav-links'} aria-label="Main">
					{LINKS.map((l) => (
						<Link key={l.href} href={l.href} className={isActive(l.href) ? 'on' : ''}>
							{t(l.key)}
							{l.href === '/mypage' && favs.length > 0 && <em className={'e-navcount'}>{favs.length}</em>}
						</Link>
					))}
				</Box>
				<Box component={'div'} className={'e-nav-r'}>
					<SoundButton />
					{cartButton}
					<Button disableRipple className="e-lang" onClick={(e) => setAnchorEl2(e.currentTarget)} endIcon={<CaretDown size={12} weight="fill" />}>
						<img src={`/img/flag/lang${lang || 'kr'}.png`} alt={lang || 'kr'} />
					</Button>
					<Menu anchorEl={anchorEl2} open={drop} onClose={() => setAnchorEl2(null)} sx={{ mt: '6px' }}>
						{[
							['kr', 'Korean'],
							['en', 'English'],
							['ru', 'Russian'],
						].map(([id, k]) => (
							<MenuItem key={id} id={id} onClick={langChoice} disableRipple>
								<img className="e-flag" src={`/img/flag/lang${id}.png`} alt="" />
								{t(k)}
							</MenuItem>
						))}
					</Menu>
				</Box>
			</Stack>
			<CartDrawer />
			<Toast />
		</Stack>
	);
};

export default withRouter(Top);
