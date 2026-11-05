import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Box, Stack } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { STAGES, webglOK } from '../../ediya/constants';
import { AU } from '../../ediya/sound';
import { glassSvg } from '../../ediya/glassSvg';
import { MENU } from '../../data/menu';

/* The whole story plays by itself: ~16 s from bag to finished glass, a short hold, then it loops.
   Scrolling is not needed; the chips jump to a stage, and the button pauses/plays. */
const PLAY_SEC = 16;
const HOLD_SEC = 3.2;
const STAGE_KEYS = ['s1', 's2', 's3', 's4', 's5'];

const HeroStory = () => {
	const { t } = useTranslation('common');
	const wrapRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctrl = useRef({ playing: true, elapsed: 0, seek: -1 });
	const [playing, setPlaying] = useState(true);
	const [stage, setStage] = useState(0);
	const [progress, setProgress] = useState(0);
	const [fade, setFade] = useState(false);
	const [noGL, setNoGL] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current,
			wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		if (!webglOK()) {
			setNoGL(true);
			return;
		}
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mobile = window.matchMedia('(max-width: 760px)').matches;
		if (reduce) {
			ctrl.current.playing = false;
			ctrl.current.elapsed = PLAY_SEC;
			setPlaying(false);
		}
		let scene: any = null,
			raf = 0,
			visible = true,
			last = performance.now(),
			lastStage = -1,
			lastProg = -1,
			disposed = false;
		import('../../ediya/heroScene').then(({ createHeroScene }) => {
			if (disposed) return;
			try {
				scene = createHeroScene(canvas, { mobile, reduceMotion: reduce, onFx: (n, i) => AU.fx(n, i) });
			} catch (e) {
				setNoGL(true);
				return;
			}
			const frame = (now: number) => {
				raf = requestAnimationFrame(frame);
				const dt = Math.min(0.1, (now - last) / 1000);
				last = now;
				const c = ctrl.current;
				if (c.seek >= 0) {
					c.elapsed = c.seek;
					c.seek = -1;
				}
				if (!visible || document.hidden) {
					AU.levels(scene.levels, false);
					return;
				}
				if (c.playing) c.elapsed += dt;
				if (c.elapsed > PLAY_SEC + HOLD_SEC) c.elapsed = 0;
				const p = Math.min(1, c.elapsed / PLAY_SEC);
				scene.update(p, now / 1000);
				AU.levels(scene.levels, c.playing);
				const st = STAGES.reduce((a, s, i) => (p >= s ? i : a), 0);
				if (st !== lastStage) {
					lastStage = st;
					setStage(st);
				}
				const pr = Math.round(p * 200) / 200;
				if (pr !== lastProg) {
					lastProg = pr;
					setProgress(pr);
				}
				setFade(c.elapsed > PLAY_SEC + HOLD_SEC - 0.45 || c.elapsed < 0.25);
			};
			raf = requestAnimationFrame(frame);
		});
		const io = new IntersectionObserver((es) => (visible = es[0].isIntersecting), { threshold: 0.05 });
		io.observe(wrap);
		const onResize = () => scene && scene.resize();
		const onMove = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse' || !scene) return;
			scene.setPointer((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
		};
		window.addEventListener('resize', onResize);
		window.addEventListener('pointermove', onMove, { passive: true });
		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			io.disconnect();
			window.removeEventListener('resize', onResize);
			window.removeEventListener('pointermove', onMove);
			AU.levels({ grind: 0, pour: 0, esp: 0, water: 0 }, false);
			scene && scene.dispose();
		};
	}, []);

	const togglePlay = () => {
		const c = ctrl.current;
		if (c.elapsed >= PLAY_SEC && !c.playing) c.seek = 0;
		c.playing = !c.playing;
		setPlaying(c.playing);
	};
	const replay = () => {
		ctrl.current.seek = 0;
		ctrl.current.playing = true;
		setPlaying(true);
	};
	const jump = (i: number) => {
		ctrl.current.seek = STAGES[i] * PLAY_SEC + 0.01;
		AU.fx('tick');
	};

	const k = STAGE_KEYS[stage];
	return (
		<Stack className={'e-hero'} ref={wrapRef}>
			<canvas ref={canvasRef} className={`e-hero-canvas ${fade ? 'fade' : ''}`} aria-hidden="true" />
			{noGL && <div className={'e-hero-fallback'} dangerouslySetInnerHTML={{ __html: glassSvg(MENU[0], { height: 420, logo: true }) }} />}
			<div className={'e-hero-shade'} />
			<Stack className={'e-hero-copy'} key={k} aria-live="polite">
				<small>{t(`hero_${k}_k`)}</small>
				<h1>{t(`hero_${k}_h`)}</h1>
				<p>{t(`hero_${k}_p`)}</p>
				<Box component={'div'} className={'e-hero-cta'}>
					<Link href={'/menu'} className={'e-btn ac'}>
						{t('hero_cta_menu')}
					</Link>
					<Link href={'/store'} className={'e-btn ghost'}>
						{t('hero_cta_store')}
					</Link>
				</Box>
			</Stack>
			<Stack className={'e-hero-ctrl'}>
				<button className={'e-icon'} onClick={togglePlay} aria-label={playing ? t('hero_pause') : t('hero_play')}>
					{playing ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
				</button>
				<div className={'e-hero-stages'}>
					{STAGE_KEYS.map((s, i) => (
						<button key={s} className={i === stage ? 'on' : ''} onClick={() => jump(i)}>
							<i style={{ ['--p' as any]: i < stage ? 1 : i === stage ? Math.min(1, (progress - STAGES[i]) / ((STAGES[i + 1] ?? 1) - STAGES[i])) : 0 }} />
							<span>{t(`hero_${s}_k`).replace(/^\d+ · /, '')}</span>
						</button>
					))}
				</div>
				<button className={'e-icon'} onClick={replay} aria-label={t('hero_replay')}>
					<ReplayRoundedIcon />
				</button>
			</Stack>
		</Stack>
	);
};

export default HeroStory;
