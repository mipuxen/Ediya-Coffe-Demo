/* Ediya hero: vertical AI video (beans -> grinder -> ice -> water -> espresso -> iced americano).
   Replaces the old Three.js scene but keeps the same API, so the hero component needs no changes. */
import { HeroLevels } from './constants';
export { STAGES } from './constants';
export type { HeroLevels } from './constants';

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const sg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export interface HeroScene {
	update: (p: number, t: number) => void;
	resize: () => void;
	setPointer: (x: number, y: number) => void;
	theme: (night: boolean) => void;
	dispose: () => void;
	levels: HeroLevels;
}

const VIDEO_SRC = '/video/ediya-americano.mp4';

export function createHeroScene(canvas: HTMLCanvasElement, opts: { mobile: boolean; reduceMotion: boolean; onFx?: (name: string, i?: number) => void }): HeroScene {
	const host = canvas.parentElement as HTMLElement;
	canvas.style.display = 'none';

	const media = document.createElement('div');
	media.className = 'e-hero-media';
	const video = document.createElement('video');
	video.className = 'e-hero-video';
	video.src = VIDEO_SRC;
	video.muted = true;
	video.loop = true;
	video.playsInline = true;
	video.preload = 'auto';
	video.setAttribute('muted', '');
	video.setAttribute('playsinline', '');
	video.setAttribute('aria-hidden', 'true');
	media.appendChild(video);
	host.insertBefore(media, canvas);

	// play only while the hero is on screen; "reduce motion" keeps the first frame
	const play = () => {
		if (!opts.reduceMotion) video.play().catch(() => {});
	};
	const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : video.pause()), { threshold: 0.15 });
	io.observe(media);

	const levels: HeroLevels = { grind: 0, pour: 0, esp: 0, water: 0 };

	return {
		update: () => {},
		resize: () => {},
		setPointer: () => {},
		theme: () => {},
		levels,
		dispose: () => {
			io.disconnect();
			video.pause();
			video.removeAttribute('src');
			video.load();
			media.remove();
			canvas.style.display = '';
		},
	};
}
