import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Stack, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import useDeviceDetect from '../hooks/useDeviceDetect';

const Footer = () => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();

	return (
		<Stack className={`e-footer ${device === 'mobile' ? 'mobile' : ''}`}>
			<Stack className={'container'}>
				<Box component={'div'} className={'e-foot-brand'}>
					<strong>
						Ediya Coffee <b>블루로드점</b>
					</strong>
					<p>{t('foot_about')}</p>
					<div className={'e-foot-social'}>
						<a href="https://github.com/mipuxen" target="_blank" rel="noreferrer" aria-label="GitHub">
							<GitHubIcon />
						</a>
					</div>
				</Box>
				<Box component={'div'} className={'e-foot-col'}>
					<strong>{t('foot_links')}</strong>
					<Link href={'/menu'}>{t('Menu')}</Link>
					<Link href={'/store'}>{t('Store')}</Link>
					<Link href={'/mypage'}>{t('My Page')}</Link>
					<Link href={'/cs'}>{t('CS')}</Link>
				</Box>
				<Box component={'div'} className={'e-foot-col'}>
					<strong>{t('foot_trail')}</strong>
					<span>{t('Ganggu')}</span>
					<span>{t('Changpo')}</span>
					<span>{t('Chuksan')}</span>
					<span>{t('Goraebul')}</span>
				</Box>
			</Stack>
			<Stack className={'container e-foot-bottom'}>
				<span>
					© {new Date().getFullYear()} Ediya Blue Road concept · Made by <b>Khoshimov Shukhratbek</b>
				</span>
				<span>{t('foot_disclaimer')}</span>
			</Stack>
		</Stack>
	);
};

export default Footer;
