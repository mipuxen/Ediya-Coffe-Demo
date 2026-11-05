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
