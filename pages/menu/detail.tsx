import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import DrinkCard from '../../libs/components/ediya/DrinkCard';
import { BANANA_ITEMS, MENU, fmtWon, getItem } from '../../libs/data/menu';
import { Size, Temp } from '../../libs/types/menu/menu';
import { useItemText } from '../../libs/ediya/useItemText';
import { glassSvg } from '../../libs/ediya/glassSvg';
import { webglOK } from '../../libs/ediya/constants';
import { addToCart } from '../../libs/ediya/cart';
import { AU } from '../../libs/ediya/sound';
import { toast } from '../../libs/components/ediya/Toast';
import { cartOpenVar, favVar } from '../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { pushRecent, toggleFav } from '../../libs/ediya/me';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Bar = ({ label, v, max, txt }: { label: string; v: number; max: number; txt: string }) => (
	<div className={'e-bar'}>
		<span>{label}</span>
		<i style={{ ['--w' as any]: `${(v / max) * 100}%` }} />
		<em>{txt}</em>
	</div>
);

const MenuDetail: NextPage = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const tx = useItemText();
	const it = getItem((router.query.id as string) ?? '');
	const [variant, setVariant] = useState(0);
	const [size, setSize] = useState<Size>('L');
	const [temp, setTemp] = useState<Temp>('ice');
	const [banana, setBanana] = useState(false);
	const [noGL, setNoGL] = useState(false);
	const favs = useReactiveVar(favVar);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const viewer = useRef<any>(null);

	/** LIFECYCLES **/
	useEffect(() => {
		if (it) pushRecent(it.id);
	}, [it?.id]);

	useEffect(() => {
		if (!it) return;
		setVariant(0);
		setSize('L');
		setBanana(false);
		setTemp(it.hotOk && it.hotDefault ? 'hot' : 'ice');
	}, [it?.id]);

	useEffect(() => {
		const c = canvasRef.current;
		if (!c || !it) return;
		if (!webglOK()) {
			setNoGL(true);
			return;
		}
		let disposed = false;
		import('../../libs/ediya/glassViewer').then(({ createGlassViewer }) => {
			if (disposed) return;
			try {
				viewer.current = createGlassViewer(c, window.matchMedia('(max-width: 760px)').matches, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
				viewer.current.show(it, size, temp);
			} catch (e) {
				setNoGL(true);
			}
		});
		const onResize = () => viewer.current?.resize();
		window.addEventListener('resize', onResize);
		return () => {
			disposed = true;
			window.removeEventListener('resize', onResize);
			viewer.current?.dispose();
			viewer.current = null;
		};
	}, [it?.id]);

	useEffect(() => {
		if (it && viewer.current) viewer.current.show(it, size, temp);
	}, [it, size, temp]);

	const related = useMemo(() => (it ? MENU.filter((m) => m.cat === it.cat && m.id !== it.id).slice(0, 4) : []), [it]);

	if (!it) {
		return (
			<div id="e-detail-page">
				<div className="container e-col">
					<div className={'e-empty'}>{router.isReady ? t('not_found') : ''}</div>
					<Link href={'/menu'} className={'e-more'}>
						{t('back_menu')}
					</Link>
				</div>
			</div>
		);
	}

	const price = (size === 'E' && it.E ? it.E : it.L) + (banana ? 500 : 0);
	const cream = it.milk ? (it.top !== 'n' ? 5 : 4) : it.top !== 'n' ? 2 : 0;
	const add = () => {
		addToCart(it, { variant, size, temp, banana });
		AU.fx('add');
		toast(`${tx.name(it)} — ${t('added')}`);
	};

	return (
		<div id="e-detail-page">
			<div className="container e-col">
				<Link href={`/menu?cat=${it.cat}`} className={'e-more back'}>
					{t('back_menu')}
				</Link>
				<div className={'e-detail'}>
					<div className={'e-viewer'}>
						<canvas ref={canvasRef} aria-label={t('drag')} />
						{noGL && <div className={'e-viewer-fb'} dangerouslySetInnerHTML={{ __html: glassSvg(it, { height: 360, hot: temp === 'hot', logo: true }) }} />}
						{!noGL && <span className={'e-viewer-hint'}>{t('drag')}</span>}
					</div>
					<div className={'e-info'}>
						<div className={'e-kick'}>{t(it.cat)}</div>
						<h1>{tx.name(it)}</h1>
						<div className={'e-sub'}>{tx.sub(it)}</div>
						<div className={'e-big-price'}>{fmtWon(price)}</div>
						<div className={'e-tags'}>
							{it.iced && <span className={'e-tag ice'}>❄ {t('t_ice')}</span>}
							{it.zero && <span className={'e-tag zero'}>{t('t_zero')}</span>}
							{it.hotOk && <span className={'e-tag'}>♨ {t('t_hot')}</span>}
							{it.milk && <span className={'e-tag'}>🥛 {t('t_milk')}</span>}
							{it.fruit && <span className={'e-tag'}>🍓 {t('t_fruit')}</span>}
						</div>
						<p className={'e-desc'}>{tx.desc(it)}</p>
						{it.variants.length > 0 && (
							<div className={'e-opt'}>
								<label>{t('variant')}</label>
								<div className={'e-chips'}>
									{it.variants.map((v, i) => (
										<button key={v.ko} className={`e-chip ${i === variant ? 'on' : ''}`} onClick={() => setVariant(i)}>
											{tx.vname(v)}
										</button>
									))}
								</div>
							</div>
						)}
						{it.E && (
							<div className={'e-opt'}>
								<label>{t('size')}</label>
								<div className={'e-seg'}>
									<button className={size === 'L' ? 'on' : ''} onClick={() => setSize('L')}>
										{t('sizeL')} · {fmtWon(it.L)}
									</button>
									<button className={size === 'E' ? 'on' : ''} onClick={() => setSize('E')}>
										{t('sizeE')} · {fmtWon(it.E)}
									</button>
								</div>
							</div>
						)}
						{it.hotOk && (
							<div className={'e-opt'}>
								<label>{t('temp')}</label>
								<div className={'e-seg'}>
									<button className={temp === 'ice' ? 'on' : ''} onClick={() => setTemp('ice')}>
										❄ {t('iced')}
									</button>
									<button className={temp === 'hot' ? 'on' : ''} onClick={() => setTemp('hot')}>
										♨ {t('hot')}
									</button>
								</div>
							</div>
						)}
						{BANANA_ITEMS.includes(it.ko) && (
							<label className={'e-check'}>
								<input type="checkbox" checked={banana} onChange={(e) => setBanana(e.target.checked)} /> {t('banana')}
							</label>
						)}
						<div className={'e-bars'}>
							<Bar label={t('b_sweet')} v={it.sweet} max={5} txt={`${it.sweet}/5`} />
							<Bar label={t('b_bitter')} v={it.bitter} max={5} txt={`${it.bitter}/5`} />
							<Bar label={t('b_caf')} v={it.caffeine} max={3} txt={t(`lv${Math.min(3, it.caffeine)}`)} />
							<Bar label={t('b_cream')} v={cream} max={5} txt={`${cream}/5`} />
						</div>
						<div className={'e-actions'}>
							<button className={'e-btn ac'} onClick={add}>
								{t('add')}
							</button>
							<button className={'e-btn line'} onClick={() => cartOpenVar(true)}>
								{t('cart')}
							</button>
							<button
								className={`e-btn line e-favbtn ${favs.includes(it.id) ? 'on' : ''}`}
								onClick={() => toggleFav(it.id)}
								aria-pressed={favs.includes(it.id)}
								aria-label={t('fav')}
							>
								{favs.includes(it.id) ? '♥' : '♡'}
							</button>
						</div>
					</div>
				</div>
				{related.length > 0 && (
					<div className={'e-related'}>
						<h3>{t('related')}</h3>
						<div className={'e-grid four'}>
							{related.map((r) => (
								<DrinkCard key={r.id} item={r} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutBasic(MenuDetail);
