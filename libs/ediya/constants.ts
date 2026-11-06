/* small shared bits kept out of the three.js modules so pages don't pull three into their first load */
export const STAGES = [0, 0.22, 0.5, 0.7, 0.88];

export interface HeroLevels {
	grind: number;
	pour: number;
	esp: number;
	water: number;
}

export const webglOK = () => {
	try {
		const c = document.createElement('canvas');
		return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
	} catch (e) {
		return false;
	}
};

/* Optional hero video. Put these in /public/video; if neither exists the 3D animation is used instead.
   The video should follow the same story as the 3D scene (bag, grinder, ice+espresso, water, finished glass):
   the stage captions and chips are mapped onto its timeline using STAGES. */
export const HERO_VIDEO = { wide: '/video/story-wide.mp4', vertical: '/video/story-vertical.mp4' };

const videoExists = async (url: string) => {
	try {
		const r = await fetch(url, { method: 'HEAD' });
		return r.ok && (r.headers.get('content-type') || '').startsWith('video');
	} catch (e) {
		return false;
	}
};

/** Returns the video URL to use for this screen, or null when no video has been added. */
export const pickHeroVideo = async (): Promise<string | null> => {
	const phone = window.matchMedia('(max-width: 760px)').matches;
	const order = phone ? [HERO_VIDEO.vertical, HERO_VIDEO.wide] : [HERO_VIDEO.wide, HERO_VIDEO.vertical];
	for (const f of order) if (await videoExists(f)) return f;
	return null;
};
