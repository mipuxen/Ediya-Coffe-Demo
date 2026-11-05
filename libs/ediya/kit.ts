/* Shared 3D helpers for the Ediya hero + drink viewer (three.js 0.150) */
import * as THREE from 'three';

/* treat hex colours as sRGB (three 0.150 defaults to legacy linear, which washes everything out) */
(THREE as any).ColorManagement.legacyMode = false;

export { webglOK } from './constants';

export const whenFonts = (fn: () => void) => {
	try {
		(document as any).fonts?.ready.then(fn);
	} catch (e) {}
};

export function makeRenderer(canvas: HTMLCanvasElement, mobile: boolean) {
	const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
	r.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.6 : 2));
	r.outputEncoding = THREE.sRGBEncoding;
	r.toneMapping = THREE.ACESFilmicToneMapping;
	r.toneMappingExposure = 1.0;
	r.setClearColor(0x000000, 0);
	return r;
}

/* studio environment -> soft reflections on glossy black + glass */
export function makeEnv(renderer: THREE.WebGLRenderer) {
	const s = new THREE.Scene();
	const geo = new THREE.SphereGeometry(20, 32, 16);
	const pos = geo.attributes.position as THREE.BufferAttribute;
	const cols: number[] = [];
	const top = new THREE.Color(0x10283c),
		mid = new THREE.Color(0x050b11),
		bot = new THREE.Color(0x020406);
	for (let i = 0; i < pos.count; i++) {
		const y = pos.getY(i) / 20;
		const c = y > 0 ? mid.clone().lerp(top, y) : mid.clone().lerp(bot, -y);
		cols.push(c.r, c.g, c.b);
	}
	geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
	s.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
	const panel = (w: number, h: number, col: number, x: number, y: number, z: number, ry = 0, rx = 0) => {
		const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
		m.position.set(x, y, z);
		m.rotation.set(rx, ry, 0);
		s.add(m);
	};
	panel(9, 2.2, 0xffffff, 0, 12, 3, 0, Math.PI / 2); /* top softbox */
	panel(1.4, 12, 0xffffff, -13, 2, 6, Math.PI / 2); /* left strip -> long highlight on black gloss */
	panel(1.2, 12, 0x7fd6ff, 13, 1, 2, -Math.PI / 2); /* teal rim strip */
	panel(5, 1.4, 0xffb877, 5, -2, -16); /* warm kicker */
	panel(3, 1.2, 0xcfe8ff, -3, 4, 18, Math.PI); /* small front fill */
	const pm = new THREE.PMREMGenerator(renderer);
	const tex = pm.fromScene(s, 0.04).texture;
	pm.dispose();
	return tex;
}

/* rounded-rectangle loft along Y */
export interface Prof {
	y: number;
	w: number;
	d: number;
	r?: number;
	x?: number;
	z?: number;
}
function rrRing(w: number, d: number, r: number, seg: number) {
	r = Math.min(r, w / 2 - 0.001, d / 2 - 0.001);
	const cx = w / 2 - r,
		cz = d / 2 - r,
		pts: [number, number][] = [];
	const C: [number, number, number][] = [
		[cx, cz, 0],
		[-cx, cz, Math.PI / 2],
		[-cx, -cz, Math.PI],
		[cx, -cz, Math.PI * 1.5],
	];
	C.forEach(([x, z, a0]) => {
		for (let i = 0; i <= seg; i++) {
			const a = a0 + (i / seg) * (Math.PI / 2);
			pts.push([x + Math.cos(a) * r, z + Math.sin(a) * r]);
		}
	});
	return pts;
}
export function loft(prof: Prof[], o: { seg?: number; caps?: 'both' | 'top' | 'bottom' | 'none' } = {}) {
	const seg = o.seg || 6,
		caps = o.caps || 'both',
		pos: number[] = [],
		idx: number[] = [];
	const rings = prof.map((p) => rrRing(p.w, p.d, p.r ?? 0.2, seg).map(([x, z]) => [x + (p.x || 0), p.y, z + (p.z || 0)]));
	const n = rings[0].length;
	rings.forEach((R) => R.forEach((v) => pos.push(v[0], v[1], v[2])));
	for (let i = 0; i < rings.length - 1; i++)
		for (let j = 0; j < n; j++) {
			const a = i * n + j,
				b = i * n + ((j + 1) % n),
				c = (i + 1) * n + ((j + 1) % n),
				d = (i + 1) * n + j;
			idx.push(a, d, b, b, d, c);
		}
	const cap = (R: number[][], up: boolean) => {
		const base = pos.length / 3;
		let cx = 0,
			cz = 0;
		R.forEach((v) => {
			cx += v[0];
			cz += v[2];
		});
		pos.push(cx / n, R[0][1], cz / n);
		R.forEach((v) => pos.push(v[0], v[1], v[2]));
		for (let j = 0; j < n; j++) {
			const p0 = base + 1 + j,
				p1 = base + 1 + ((j + 1) % n);
			if (up) idx.push(base, p1, p0);
			else idx.push(base, p0, p1);
		}
	};
	if (caps === 'both' || caps === 'bottom') cap(rings[0], false);
	if (caps === 'both' || caps === 'top') cap(rings[rings.length - 1], true);
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
	g.setIndex(idx);
	g.computeVertexNormals();
	return g;
}

export function rrShape(w: number, h: number, r: number) {
	const s = new THREE.Shape(),
		x = -w / 2,
		y = -h / 2;
	s.moveTo(x + r, y);
	s.lineTo(x + w - r, y);
	s.quadraticCurveTo(x + w, y, x + w, y + r);
	s.lineTo(x + w, y + h - r);
	s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	s.lineTo(x + r, y + h);
	s.quadraticCurveTo(x, y + h, x, y + h - r);
	s.lineTo(x, y + r);
	s.quadraticCurveTo(x, y, x + r, y);
	return s;
}

export function slab(w: number, h: number, depth: number, r: number, bevel: number) {
	const g = new THREE.ExtrudeGeometry(rrShape(w, h, r), {
		depth,
		bevelEnabled: true,
		bevelThickness: bevel,
		bevelSize: bevel,
		bevelSegments: 3,
		curveSegments: 8,
	});
	g.translate(0, 0, -depth / 2);
	return g;
}

export function beanGeo() {
	const g = new THREE.SphereGeometry(0.15, 14, 10);
	const p = g.attributes.position as THREE.BufferAttribute;
	for (let i = 0; i < p.count; i++) {
		const x = p.getX(i),
			y = p.getY(i),
			z = p.getZ(i);
		const groove = y > 0 ? 0.055 * Math.exp(-Math.pow(x / 0.03, 2)) : 0;
		p.setXYZ(i, x, y * 0.66 - groove, z * 0.6);
	}
	g.computeVertexNormals();
	return g;
}

export function iceGeo(s: number) {
	const g = new THREE.ExtrudeGeometry(rrShape(s, s, s * 0.22), {
		depth: s * 0.82,
		bevelEnabled: true,
		bevelThickness: s * 0.09,
		bevelSize: s * 0.08,
		bevelSegments: 2,
		curveSegments: 4,
	});
	g.center();
	return g;
}

export function canvasTex(cv: HTMLCanvasElement) {
	const t = new THREE.CanvasTexture(cv);
	t.encoding = THREE.sRGBEncoding;
	t.anisotropy = 4;
	return t;
}

/* frosted transparent wordmark for the glass (plain type, not the official logo artwork) */
export function logoCanvas(cv?: HTMLCanvasElement) {
	const c = cv || document.createElement('canvas');
	c.width = 1024;
	c.height = 512;
	const x = c.getContext('2d')!;
	x.clearRect(0, 0, 1024, 512);
	x.textAlign = 'center';
	x.textBaseline = 'middle';
	x.fillStyle = 'rgba(255,255,255,.95)';
	x.font = '700 200px Poppins, "Pretendard Variable", Arial, sans-serif';
	x.fillText('EDIYA', 512, 170);
	x.fillText('COFFEE', 512, 360);
	return c;
}

/* tumbler: H=3, bottom r .8 -> top r 1.0, thick teal-tinted base like the reference shot */
export const GH = 3,
	R0 = 0.8,
	R1 = 1.0,
	WALL = 0.05,
	BASE = 0.26;
export const rOut = (y: number) => R0 + (R1 - R0) * (y / GH);
export const rIn = (y: number) => rOut(y) - WALL;

export interface Tumbler {
	group: THREE.Group;
	glassMat: THREE.MeshPhysicalMaterial;
	liqMat: THREE.MeshPhysicalMaterial;
	crema: THREE.Mesh<THREE.CircleGeometry, THREE.MeshStandardMaterial>;
	setLevel: (h: number) => void;
}

export function tumbler(env: THREE.Texture, mobile: boolean): Tumbler {
	const g = new THREE.Group();
	const prof: THREE.Vector2[] = [];
	const N = 14;
	prof.push(new THREE.Vector2(0.001, 0));
	prof.push(new THREE.Vector2(R0 - 0.03, 0));
	prof.push(new THREE.Vector2(R0, 0.03));
	for (let i = 1; i <= N; i++) {
		const y = (GH * i) / N;
		prof.push(new THREE.Vector2(rOut(y), y));
	}
	prof.push(new THREE.Vector2(rIn(GH) + 0.012, GH + 0.018));
	for (let i = N; i >= 0; i--) {
		const y = BASE + ((GH - BASE) * i) / N;
		prof.push(new THREE.Vector2(rIn(y), y));
	}
	prof.push(new THREE.Vector2(0.001, BASE));
	const glassMat = new THREE.MeshPhysicalMaterial({
		color: 0xcfe8ff,
		metalness: 0,
		roughness: 0.03,
		clearcoat: 1,
		clearcoatRoughness: 0.03,
		transparent: true,
		opacity: 0.1,
		envMap: env,
		envMapIntensity: 1.4,
		side: THREE.FrontSide,
		depthWrite: false,
	});
	const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, mobile ? 40 : 64), glassMat);
	glass.renderOrder = 3;
	g.add(glass);
	const base = new THREE.Mesh(
		new THREE.CylinderGeometry(R0 - 0.06, R0 - 0.04, BASE - 0.04, mobile ? 32 : 48),
		new THREE.MeshPhysicalMaterial({ color: 0x3fa89f, roughness: 0.08, transparent: true, opacity: 0.38, envMap: env, envMapIntensity: 1.2, clearcoat: 1, depthWrite: false }),
	);
	base.position.y = BASE / 2;
	base.renderOrder = 2;
	g.add(base);
	/* liquid: unit cylinder re-shaped each frame to follow the taper */
	const lg = new THREE.CylinderGeometry(1, 1, 1, mobile ? 36 : 56, 1, false);
	lg.translate(0, 0.5, 0);
	const orig = ((lg.attributes.position as THREE.BufferAttribute).array as Float32Array).slice();
	const liqMat = new THREE.MeshPhysicalMaterial({ color: 0x0d0502, roughness: 0.18, clearcoat: 0.25, clearcoatRoughness: 0.1, transparent: true, opacity: 0.97, envMap: env, envMapIntensity: 0.45 });
	const liquid = new THREE.Mesh(lg, liqMat);
	liquid.position.y = BASE;
	liquid.renderOrder = 1;
	g.add(liquid);
	const crema = new THREE.Mesh(new THREE.CircleGeometry(1, mobile ? 36 : 56), new THREE.MeshStandardMaterial({ color: 0x8a5a30, roughness: 0.85, transparent: true, opacity: 0.9 }));
	crema.rotation.x = -Math.PI / 2;
	crema.renderOrder = 2;
	g.add(crema);
	let lastH = -1;
	const setLevel = (hIn: number) => {
		const h = Math.max(0.002, Math.min(GH - BASE - 0.12, hIn));
		if (Math.abs(h - lastH) < 0.0005) return;
		lastH = h;
		const a = (lg.attributes.position as THREE.BufferAttribute).array as Float32Array;
		for (let i = 0; i < a.length; i += 3) {
			const y = orig[i + 1] * h;
			const r = rIn(BASE + y) - 0.012;
			a[i] = orig[i] * r;
			a[i + 1] = y;
			a[i + 2] = orig[i + 2] * r;
		}
		lg.attributes.position.needsUpdate = true;
		lg.computeBoundingSphere();
		crema.position.y = BASE + h + 0.004;
		const cr = rIn(BASE + h) - 0.014;
		crema.scale.set(cr, cr, 1);
	};
	/* frosted wordmark wrapped on the front of the glass */
	const lcv = logoCanvas(),
		y0 = 1.0,
		y1 = 2.15,
		tex = canvasTex(lcv);
	whenFonts(() => {
		logoCanvas(lcv);
		tex.needsUpdate = true;
	});
	const lgeo = new THREE.CylinderGeometry(rOut(y1) + 0.008, rOut(y0) + 0.008, y1 - y0, 48, 1, true, -0.78, 1.56);
	const logo = new THREE.Mesh(lgeo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.62, depthWrite: false, toneMapped: false }));
	logo.position.y = (y0 + y1) / 2;
	logo.renderOrder = 4;
	g.add(logo);
	setLevel(0.002);
	return { group: g, glassMat, liqMat, crema, setLevel };
}
