/* Ediya hero: bag -> scissors -> grinder (modelled on the Casadio reference) -> ice + espresso -> water -> iced americano.
   Driven by a progress value p in [0,1]; HeroStory.tsx advances p on a clock so it plays by itself. */
import * as THREE from 'three';
import * as KIT from './kit';

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const sg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

import { HeroLevels } from './constants';
export { STAGES } from './constants';
export type { HeroLevels } from './constants';

export interface HeroScene {
	update: (p: number, t: number) => void;
	resize: () => void;
	setPointer: (x: number, y: number) => void;
	theme: (night: boolean) => void;
	dispose: () => void;
	levels: HeroLevels;
}

export function createHeroScene(canvas: HTMLCanvasElement, opts: { mobile: boolean; reduceMotion: boolean; onFx?: (name: string, i?: number) => void }): HeroScene {
	const mobile = opts.mobile,
		Q = mobile ? 0.6 : 1;
	const renderer = KIT.makeRenderer(canvas, mobile);
	const env = KIT.makeEnv(renderer);
	const scene = new THREE.Scene();
	scene.environment = env;
	scene.fog = new THREE.Fog(0x06131f, 18, 42);
	const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
	const hemi = new THREE.HemisphereLight(0xbfe3ff, 0x0a1622, 0.3);
	scene.add(hemi);
	const key = new THREE.DirectionalLight(0xfff0e0, 1.05);
	key.position.set(5, 10, 8);
	scene.add(key);
	const rim = new THREE.PointLight(0x4ec3ff, 1.8, 34);
	rim.position.set(-6, 3, -3);
	scene.add(rim);
	const rim2 = new THREE.PointLight(0x4ec3ff, 1.6, 30);
	rim2.position.set(-5, -5, -2);
	scene.add(rim2);
	const warm = new THREE.PointLight(0xffb070, 0.5, 26);
	warm.position.set(4, 1, 6);
	scene.add(warm);

	/* ---------- materials ---------- */
	const gloss = new THREE.MeshPhysicalMaterial({ color: 0x050607, roughness: 0.32, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6 });
	const gloss2 = new THREE.MeshPhysicalMaterial({ color: 0x0b0d10, roughness: 0.3, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.6 });
	const inset = new THREE.MeshPhysicalMaterial({ color: 0x040506, roughness: 0.3, metalness: 0.1, clearcoat: 0.8, envMapIntensity: 0.9 });
	const chrome = new THREE.MeshStandardMaterial({ color: 0xd9e1ea, metalness: 1, roughness: 0.16, envMapIntensity: 1.4 });
	const steel = new THREE.MeshStandardMaterial({ color: 0x6c747e, metalness: 0.95, roughness: 0.3 });
	const copper = new THREE.MeshStandardMaterial({ color: 0xd8925a, metalness: 1, roughness: 0.24, envMapIntensity: 1.5 });
	const copperDS = copper.clone();
	copperDS.side = THREE.DoubleSide;
	const rubber = new THREE.MeshStandardMaterial({ color: 0x101113, roughness: 0.55, metalness: 0.1 });
	const hopperMat = new THREE.MeshPhysicalMaterial({ color: 0xd4e2ec, roughness: 0.03, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.16, envMapIntensity: 2, side: THREE.DoubleSide, depthWrite: false });
	const smoke = new THREE.MeshPhysicalMaterial({ color: 0x101318, roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0.86, envMapIntensity: 1.4 });
	const beanMat = new THREE.MeshStandardMaterial({ color: 0x3a1e0e, roughness: 0.38, metalness: 0.05 });
	const kraft = new THREE.MeshStandardMaterial({ color: 0x8c6236, roughness: 0.82 });
	const kraft2 = new THREE.MeshStandardMaterial({ color: 0x6e4b28, roughness: 0.88 });
	const dark = new THREE.MeshBasicMaterial({ color: 0x050302 });
	const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, par: THREE.Object3D = scene) => {
		const m = new THREE.Mesh(geo, mat);
		m.position.set(x, y, z);
		par.add(m);
		return m;
	};

	/* ---------- grinder ---------- */
	const GR = new THREE.Group();
	scene.add(GR);
	const plinth = add(KIT.slab(2.85, 2.95, 0.34, 0.34, 0.05), gloss2, 0, 0.22, 0.12, GR);
	plinth.rotation.x = -Math.PI / 2;
	add(
		KIT.loft(
			[
				{ y: 0.42, w: 2.45, d: 2.55, r: 0.32 },
				{ y: 0.9, w: 2.3, d: 2.5, r: 0.3 },
				{ y: 1.8, w: 2.12, d: 2.4, r: 0.28 },
				{ y: 3.2, w: 2.05, d: 2.32, r: 0.26 },
				{ y: 3.42, w: 2.28, d: 2.34, r: 0.28 },
				{ y: 4.7, w: 2.3, d: 2.34, r: 0.28 },
				{ y: 4.9, w: 2.18, d: 2.22, r: 0.22 },
				{ y: 4.97, w: 1.9, d: 1.95, r: 0.16 },
			],
			{ seg: 7 },
		),
		gloss,
		0,
		0,
		0,
		GR,
	);
	const FZ = 1.17;
	add(KIT.slab(1.12, 2.4, 0.04, 0.1, 0.01), inset, 0, 2.05, 1.21, GR);
	[-0.6, 0.6].forEach((x) => add(KIT.slab(0.1, 2.4, 0.42, 0.04, 0.01), gloss2, x, 2.05, 1.38, GR));
	add(KIT.slab(1.32, 0.12, 0.44, 0.05, 0.01), gloss2, 0, 3.27, 1.38, GR);
	add(KIT.slab(1.02, 0.08, 0.46, 0.04, 0.01), gloss2, 0, 1.12, 1.42, GR);
	add(new THREE.BoxGeometry(0.34, 0.2, 0.5), inset, 0, 3.08, 1.42, GR);
	[-0.42, 0.42].forEach((x) => add(KIT.slab(0.08, 0.05, 0.7, 0.02, 0.008), chrome, x, 2.61, 1.6, GR));
	const cav = add(new THREE.ShapeGeometry(KIT.rrShape(1.5, 1.06, 0.12)), new THREE.MeshBasicMaterial({ color: 0x07090b }), 0, 4.02, FZ + 0.004, GR);
	const bz = KIT.rrShape(1.66, 1.22, 0.16);
	bz.holes.push(KIT.rrShape(1.5, 1.06, 0.12));
	add(new THREE.ExtrudeGeometry(bz, { depth: 0.04, bevelEnabled: false, curveSegments: 8 }), chrome, 0, 4.02, FZ - 0.01, GR);
	const burrLight = new THREE.PointLight(0xffa860, 0, 4);
	burrLight.position.set(0, 4.05, FZ + 0.9);
	GR.add(burrLight);
	const burr = new THREE.Group();
	GR.add(burr);
	add(new THREE.CylinderGeometry(0.56, 0.56, 0.4, 48, 1, true), copperDS, 0, 0, 0, burr);
	for (let i = 0; i < 22; i++) {
		const a = (i / 22) * Math.PI * 2;
		const t = add(new THREE.BoxGeometry(0.05, 0.34, 0.09), copper, Math.cos(a) * 0.51, 0, Math.sin(a) * 0.51, burr);
		t.rotation.y = -a;
	}
	add(new THREE.CylinderGeometry(0.62, 0.62, 0.06, 40), steel, 0, -0.23, 0, burr);
	const cone = new THREE.Group();
	burr.add(cone);
	add(
		new THREE.LatheGeometry(
			[
				[0.001, 0.4],
				[0.1, 0.38],
				[0.26, 0.14],
				[0.4, -0.12],
				[0.43, -0.2],
				[0.001, -0.2],
			].map((v) => new THREE.Vector2(v[0], v[1])),
			36,
		),
		steel,
		0,
		0,
		0,
		cone,
	);
	for (let k = 0; k < 7; k++) {
		const pts: THREE.Vector3[] = [];
		for (let i = 0; i <= 24; i++) {
			const t = i / 24,
				y = 0.36 - t * 0.54,
				rc = lerp(0.11, 0.43, (0.38 - y) / 0.58) + 0.012,
				a = (k / 7) * Math.PI * 2 + t * 2.3;
			pts.push(new THREE.Vector3(Math.cos(a) * rc, y, Math.sin(a) * rc));
		}
		add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, 0.024, 5), copper, 0, 0, 0, cone);
	}
	add(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16), chrome, 0, 0.44, 0, cone);
	/* sliding front panel with screen */
	const panel = new THREE.Group();
	panel.position.set(0, 4.02, FZ + 0.045);
	GR.add(panel);
	add(KIT.slab(1.62, 1.18, 0.07, 0.12, 0.02), gloss2, 0, 0, 0, panel);
	add(new THREE.PlaneGeometry(1.12, 0.8), new THREE.MeshPhysicalMaterial({ color: 0x020304, roughness: 0.05, clearcoat: 1 }), 0, 0.08, 0.066, panel);
	const scv = document.createElement('canvas');
	scv.width = 512;
	scv.height = 360;
	const sx = scv.getContext('2d')!;
	const stex = KIT.canvasTex(scv);
	add(new THREE.PlaneGeometry(1.04, 0.72), new THREE.MeshBasicMaterial({ map: stex, toneMapped: false }), 0, 0.08, 0.07, panel);
	[-0.52, 0.52].forEach((x) => {
		const s = add(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), chrome, x, -0.43, 0.07, panel);
		s.rotation.x = Math.PI / 2;
	});
	/* side grind-adjust knob */
	const knob = new THREE.Group();
	knob.position.set(1.15, 4.55, 0.35);
	GR.add(knob);
	add(new THREE.CylinderGeometry(0.06, 0.06, 0.34, 12), rubber, 0.17, 0, 0, knob).rotation.z = Math.PI / 2;
	add(new THREE.CylinderGeometry(0.27, 0.27, 0.2, 40), chrome, 0.42, 0, 0, knob).rotation.z = Math.PI / 2;
	for (let i = 0; i < 28; i++) {
		const a = (i / 28) * Math.PI * 2;
		add(new THREE.BoxGeometry(0.18, 0.03, 0.03), chrome, 0.42, Math.cos(a) * 0.275, Math.sin(a) * 0.275, knob).rotation.x = a;
	}
	add(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24), rubber, 0.53, 0, 0, knob).rotation.z = Math.PI / 2;
	/* hopper + lid */
	const HP = [
		{ y: 4.96, w: 1.42, d: 1.32, r: 0.3 },
		{ y: 5.45, w: 1.44, d: 1.34, r: 0.3 },
		{ y: 5.64, w: 1.6, d: 1.42, r: 0.3 },
		{ y: 6.25, w: 2.08, d: 1.66, r: 0.32 },
		{ y: 6.78, w: 2.24, d: 1.76, r: 0.32 },
	];
	add(KIT.loft(HP, { caps: 'none', seg: 7 }), hopperMat, 0, 0, 0, GR).renderOrder = 3;
	add(
		KIT.loft([
			{ y: 4.94, w: 1.52, d: 1.42, r: 0.3 },
			{ y: 5.1, w: 1.52, d: 1.42, r: 0.3 },
		]),
		gloss,
		0,
		0,
		0,
		GR,
	);
	const lid = new THREE.Group();
	lid.position.set(0, 6.78, -0.88);
	GR.add(lid);
	add(
		KIT.loft([
			{ y: 0, w: 2.32, d: 1.84, r: 0.34, z: 0.88 },
			{ y: 0.15, w: 2.32, d: 1.84, r: 0.34, z: 0.88 },
			{ y: 0.22, w: 2.18, d: 1.7, r: 0.3, z: 0.88 },
		]),
		smoke,
		0,
		0,
		0,
		lid,
	);
	add(KIT.slab(0.5, 0.36, 0.2, 0.07, 0.02), gloss, 0, 0.36, 1.45, lid).rotation.x = -0.4;
	const hopW = (y: number): [number, number] => {
		for (let i = 0; i < HP.length - 1; i++)
			if (y <= HP[i + 1].y) {
				const t = (y - HP[i].y) / (HP[i + 1].y - HP[i].y);
				return [lerp(HP[i].w, HP[i + 1].w, t), lerp(HP[i].d, HP[i + 1].d, t)];
			}
		return [HP[4].w, HP[4].d];
	};

	/* ---------- beans ---------- */
	const bgeo = KIT.beanGeo(),
		dum = new THREE.Object3D(),
		tmpC = new THREE.Color();
	const NB = Math.round(420 * Q);
	const hb = new THREE.InstancedMesh(bgeo, beanMat, NB);
	GR.add(hb);
	const hbd = Array.from({ length: NB }, (_, i) => {
		const y = 4.98 + (i / NB) * 1.62;
		const [w, d] = hopW(y);
		return { x: (Math.random() - 0.5) * (w - 0.34), y, z: (Math.random() - 0.5) * (d - 0.34), r: [Math.random() * 6, Math.random() * 6, Math.random() * 6] };
	});
	for (let i = 0; i < NB; i++) {
		tmpC.setHSL(0.06 + Math.random() * 0.02, 0.55, 0.32 + Math.random() * 0.18);
		hb.setColorAt(i, tmpC);
	}
	let lastFill = -1;
	const setFill = (f: number) => {
		if (Math.abs(f - lastFill) < 0.004) return;
		lastFill = f;
		hbd.forEach((b, i) => {
			dum.position.set(b.x, b.y, b.z);
			dum.rotation.set(b.r[0], b.r[1], b.r[2]);
			dum.scale.setScalar(b.y < f ? 1 : 0);
			dum.updateMatrix();
			hb.setMatrixAt(i, dum.matrix);
		});
		hb.instanceMatrix.needsUpdate = true;
	};
	const NP = Math.round(80 * Q);
	const pb = new THREE.InstancedMesh(bgeo, beanMat, NP);
	pb.frustumCulled = false;
	scene.add(pb);
	const pbd = Array.from({ length: NP }, (_, k) => ({
		s: 0.1 + (k / NP) * 0.105,
		ox: (Math.random() - 0.5) * 0.25,
		oz: (Math.random() - 0.5) * 0.2,
		tx: (Math.random() - 0.5) * 1.2,
		tz: (Math.random() - 0.5) * 0.8,
		r: [Math.random() * 6, Math.random() * 6, Math.random() * 6],
		sp: 3 + Math.random() * 5,
	}));
	const NG = 10;
	const gb = new THREE.InstancedMesh(bgeo, beanMat, NG);
	gb.frustumCulled = false;
	GR.add(gb);
	const gbd = Array.from({ length: NG }, (_, k) => ({ o: k / NG, x: (Math.random() - 0.5) * 0.5, r: [Math.random() * 6, Math.random() * 6] }));

	/* ---------- grounds ---------- */
	const NGP = Math.round(520 * Q),
		gpos = new Float32Array(NGP * 3);
	const gpg = new THREE.BufferGeometry();
	gpg.setAttribute('position', new THREE.BufferAttribute(gpos, 3));
	const gpm = new THREE.PointsMaterial({ color: 0x6a4426, size: 0.04, transparent: true, opacity: 0, depthWrite: false });
	const gpts = new THREE.Points(gpg, gpm);
	gpts.frustumCulled = false;
	GR.add(gpts);
	const gpr = Array.from({ length: NGP }, () => ({ o: Math.random(), a: Math.random() * 6.28, r: Math.random(), v: 0.7 + Math.random() * 0.6 }));

	/* ---------- portafilter ---------- */
	const PF = new THREE.Group();
	scene.add(PF);
	add(
		new THREE.LatheGeometry(
			[
				[0.001, -0.26],
				[0.3, -0.26],
				[0.36, -0.21],
				[0.4, -0.06],
				[0.42, 0],
				[0.47, 0.02],
				[0.47, 0.07],
				[0.4, 0.07],
				[0.38, 0.01],
				[0.34, -0.18],
				[0.001, -0.2],
			].map((v) => new THREE.Vector2(v[0], v[1])),
			40,
		),
		chrome,
		0,
		0,
		0,
		PF,
	);
	[-1, 1].forEach((s) => (add(new THREE.BoxGeometry(0.16, 0.06, 0.14), chrome, s * 0.52, 0.03, 0, PF).rotation.y = s * 0.2));
	add(new THREE.CylinderGeometry(0.085, 0.12, 1.55, 20), rubber, 0, -0.07, 1.25, PF).rotation.x = Math.PI / 2 + 0.1;
	add(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 20), chrome, 0, -0.02, 0.5, PF).rotation.x = Math.PI / 2;
	const spouts = [-0.11, 0.11].map((x) => add(new THREE.CylinderGeometry(0.045, 0.03, 0.15, 12), chrome, x, -0.32, 0, PF));
	const mound = add(new THREE.SphereGeometry(0.355, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3b2414, roughness: 1 }), 0, -0.02, 0, PF);
	const PF0 = new THREE.Vector3(0, 2.6, 1.72);

	/* ---------- glass, ice, streams ---------- */
	const GY = -8.2;
	const TB = KIT.tumbler(env, mobile);
	const glassG = TB.group;
	glassG.position.set(0, GY, 0);
	scene.add(glassG);
	const iceMat = new THREE.MeshPhysicalMaterial({ color: 0xeaf7ff, roughness: 0.06, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.5, envMapIntensity: 1.8 });
	const igeo = KIT.iceGeo(0.5);
	const REST = [
		[-0.27, 0.58, 0.1],
		[0.27, 0.6, -0.1],
		[0.02, 0.62, 0.33],
		[0, 1.12, -0.26],
		[-0.24, 1.18, 0.22],
		[0.28, 1.15, 0.18],
		[0.04, 1.68, 0],
	];
	const ice = REST.map((r, i) => {
		const m = add(igeo, iceMat, 0, 0, 0, glassG);
		m.renderOrder = 2;
		return { m, r, s: 0.505 + i * 0.013, sx: (Math.random() - 0.5) * 1.4, sz: (Math.random() - 0.5) * 0.6, rr: [Math.random() * 3, Math.random() * 3, Math.random() * 3], sp: [2 + Math.random() * 3, 1 + Math.random() * 3, Math.random() * 2], landed: false };
	});
	const streamMat = (c: number, o: number) => new THREE.MeshPhysicalMaterial({ color: c, transparent: true, opacity: o, roughness: 0.1, clearcoat: 1, envMapIntensity: 1.2 });
	const cylU = new THREE.CylinderGeometry(1, 1, 1, 12, 1, true);
	const es = [0, 1].map(() => {
		const m = new THREE.Mesh(cylU, streamMat(0x1a0b05, 0.95));
		m.visible = false;
		scene.add(m);
		return m;
	});
	const ws = new THREE.Mesh(cylU, streamMat(0xcfeaff, 0.22));
	ws.visible = false;
	scene.add(ws);
	const stream = (m: THREE.Mesh, x: number, z: number, top: number, bot: number, r: number) => {
		m.visible = top > bot + 0.01 && r > 0.002;
		if (!m.visible) return;
		m.scale.set(r, top - bot, r);
		m.position.set(x, (top + bot) / 2, z);
	};
	const ND = Math.round(220 * Q);
	const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 8, 6), new THREE.MeshPhysicalMaterial({ color: 0xdff2ff, transparent: true, opacity: 0.32, roughness: 0.02, clearcoat: 1, envMapIntensity: 2.5 }), ND);
	drops.renderOrder = 5;
	glassG.add(drops);
	const dd = Array.from({ length: ND }, () => ({ y: 0.35 + Math.random() * 2.5, a: (Math.random() - 0.5) * Math.PI * 1.9, s: 0.35 + Math.random() * 0.75 }));
	let lastDrop = -1;
	const setDrops = (k: number) => {
		if (Math.abs(k - lastDrop) < 0.01) return;
		lastDrop = k;
		dd.forEach((d, i) => {
			const r = KIT.rOut(d.y) + 0.012;
			dum.position.set(Math.sin(d.a) * r, d.y, Math.cos(d.a) * r);
			dum.rotation.set(0, d.a, 0);
			dum.scale.set(d.s * k + 1e-4, d.s * k * 1.25 + 1e-4, d.s * k * 0.5 + 1e-4);
			dum.updateMatrix();
			drops.setMatrixAt(i, dum.matrix);
		});
		drops.instanceMatrix.needsUpdate = true;
	};
	setDrops(0);

	/* ---------- coffee bag + scissors ---------- */
	const bag = new THREE.Group();
	scene.add(bag);
	add(
		KIT.loft(
			[
				{ y: -1.45, w: 1.7, d: 0.62, r: 0.26 },
				{ y: -1.22, w: 2.0, d: 0.98, r: 0.4 },
				{ y: 0.9, w: 2.05, d: 1.0, r: 0.42 },
				{ y: 1.25, w: 2.02, d: 0.8, r: 0.35 },
			],
			{ caps: 'bottom', seg: 6 },
		),
		kraft,
		0,
		0,
		0,
		bag,
	);
	add(new THREE.ShapeGeometry(KIT.rrShape(1.94, 0.74, 0.3)), dark, 0, 1.235, 0, bag).rotation.x = -Math.PI / 2;
	const lcv = document.createElement('canvas');
	lcv.width = 512;
	lcv.height = 560;
	const drawLabel = () => {
		const x = lcv.getContext('2d')!;
		x.clearRect(0, 0, 512, 560);
		x.fillStyle = '#0f4a72';
		x.beginPath();
		if ((x as any).roundRect) (x as any).roundRect(24, 40, 464, 470, 30);
		else x.rect(24, 40, 464, 470);
		x.fill();
		x.fillStyle = '#fff';
		x.textAlign = 'center';
		x.font = '700 66px Poppins, Arial, sans-serif';
		x.fillText('BLUE ROAD', 256, 180);
		x.font = '700 44px Poppins, Arial, sans-serif';
		x.fillStyle = '#bfe9ff';
		x.fillText('BLEND', 256, 240);
		x.strokeStyle = '#ffb36b';
		x.lineWidth = 6;
		x.beginPath();
		x.moveTo(90, 300);
		x.bezierCurveTo(170, 260, 250, 340, 330, 300);
		x.bezierCurveTo(380, 276, 410, 300, 430, 290);
		x.stroke();
		x.fillStyle = '#fff';
		x.font = '600 40px "Pretendard Variable", Pretendard, sans-serif';
		x.fillText('블루로드점 · 원두', 256, 390);
		x.font = '500 26px Poppins, Arial, sans-serif';
		x.fillStyle = '#9fd3f2';
		x.fillText('ROASTED FOR YEONGDEOK', 256, 450);
	};
	drawLabel();
	const ltex = KIT.canvasTex(lcv);
	KIT.whenFonts(() => {
		drawLabel();
		ltex.needsUpdate = true;
	});
	add(new THREE.PlaneGeometry(1.3, 1.42), new THREE.MeshStandardMaterial({ map: ltex, transparent: true, roughness: 0.7 }), 0, -0.12, 0.512, bag);
	const seam = add(
		KIT.loft([
			{ y: 0, w: 2.02, d: 0.8, r: 0.35 },
			{ y: 0.2, w: 1.98, d: 0.36, r: 0.15 },
			{ y: 0.36, w: 1.96, d: 0.14, r: 0.06 },
		]),
		kraft2,
	);
	const scis = new THREE.Group();
	scis.scale.setScalar(1.35);
	scene.add(scis);
	const bladeShape = () => {
		const s = new THREE.Shape();
		s.moveTo(0, -0.05);
		s.lineTo(1.05, -0.01);
		s.lineTo(1.05, 0.012);
		s.lineTo(0, 0.06);
		s.lineTo(0, -0.05);
		return s;
	};
	const handleMat = new THREE.MeshStandardMaterial({ color: 0xff8a3d, roughness: 0.45 });
	const blade = (sign: number) => {
		const g = new THREE.Group();
		scis.add(g);
		add(new THREE.ExtrudeGeometry(bladeShape(), { depth: 0.03, bevelEnabled: false }), chrome, 0, 0, sign * 0.02, g);
		add(new THREE.TorusGeometry(0.17, 0.045, 10, 24), handleMat, -0.34, sign * 0.13, sign * 0.02, g);
		return g;
	};
	const sb1 = blade(1),
		sb2 = blade(-1);
	add(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12), chrome, 0, 0, 0, scis).rotation.x = Math.PI / 2;
	const BAG0 = new THREE.Vector3(0, 9.95, 0),
		BAG1 = new THREE.Vector3(1.04, 9.03, 0),
		mouthLocal = new THREE.Vector3(0, 1.25, 0),
		mouthW = new THREE.Vector3();

	/* ---------- grinder screen ---------- */
	let lastScr = '';
	const drawScreen = (mode: string, dose: number) => {
		const k = mode + dose.toFixed(1);
		if (k === lastScr) return;
		lastScr = k;
		const x = sx;
		const g = x.createLinearGradient(0, 0, 0, 360);
		g.addColorStop(0, '#071119');
		g.addColorStop(1, '#02060a');
		x.fillStyle = g;
		x.fillRect(0, 0, 512, 360);
		x.textAlign = 'center';
		x.textBaseline = 'middle';
		if (mode === 'idle') {
			x.fillStyle = '#fff';
			x.font = '700 54px Poppins, Arial, sans-serif';
			x.fillText('EDIYA COFFEE', 256, 140);
			x.fillStyle = '#4ec3ff';
			x.font = '600 40px "Pretendard Variable", Pretendard, sans-serif';
			x.fillText('블루로드점', 256, 205);
			x.strokeStyle = '#ff9d52';
			x.lineWidth = 4;
			x.beginPath();
			x.moveTo(150, 250);
			x.bezierCurveTo(200, 228, 250, 272, 300, 250);
			x.bezierCurveTo(330, 236, 350, 252, 362, 246);
			x.stroke();
			x.fillStyle = '#5f7d92';
			x.font = '500 20px Poppins, Arial, sans-serif';
			x.fillText('BLUE ROAD · ON DEMAND GRINDER', 256, 310);
		} else {
			const done = mode === 'done';
			x.fillStyle = done ? '#6fe3c1' : '#4ec3ff';
			x.font = '600 24px Poppins, Arial, sans-serif';
			x.fillText(done ? 'READY  ✓' : 'GRINDING', 256, 60);
			x.fillStyle = '#fff';
			x.font = '700 120px Poppins, Arial, sans-serif';
			x.fillText(dose.toFixed(1), 236, 170);
			x.font = '600 44px Poppins, Arial, sans-serif';
			x.fillStyle = '#9db8d0';
			x.fillText('g', 382, 190);
			x.fillStyle = '#163045';
			x.fillRect(80, 260, 352, 14);
			x.fillStyle = done ? '#6fe3c1' : '#ff9d52';
			x.fillRect(80, 260, (352 * dose) / 18, 14);
			x.fillStyle = '#5f7d92';
			x.font = '500 22px Poppins, Arial, sans-serif';
			x.fillText('TARGET 18.0 g · EDIYA COFFEE', 256, 315);
		}
		stex.needsUpdate = true;
	};
	drawScreen('idle', 0);
	KIT.whenFonts(() => {
		lastScr = '';
		drawScreen('idle', 0);
	});

	/* ---------- camera path ---------- */
	const K = [
		[0, 0, 10.9, 8.2, 0, 10.15, 0],
		[0.07, 0.9, 10.2, 8.2, 0.3, 9.6, 0],
		[0.15, 1.6, 8.9, 8.6, 0.4, 7.9, 0],
		[0.23, 2.6, 6.9, 10.2, 0, 5.0, 0],
		[0.31, 3.3, 4.9, 7.4, 0.4, 4.1, 0.8],
		[0.42, 1.9, 4.25, 5.4, 0.75, 3.95, 1.0],
		[0.49, 2.6, 3.2, 6.0, 0.3, 2.75, 1.3],
		[0.56, 2.4, -1.6, 9.4, 0, -4.6, 0.5],
		[0.7, 1.5, -4.4, 7.0, 0, -5.9, 0],
		[0.86, -1.4, -4.6, 7.0, 0, -6.1, 0],
		[1, 0, -5.0, 6.4, 0, -6.65, 0],
	];
	const look = new THREE.Vector3(),
		cpos = new THREE.Vector3(),
		tmp = new THREE.Vector3();
	let portrait = false,
		aspect = 1,
		px = 0,
		py = 0,
		tpx = 0,
		tpy = 0;
	const cam = (p: number) => {
		let i = 0;
		while (i < K.length - 2 && p > K[i + 1][0]) i++;
		const a = K[i],
			b = K[i + 1],
			t = ease(sg(p, a[0], b[0]));
		cpos.set(lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t));
		look.set(lerp(a[4], b[4], t), lerp(a[5], b[5], t), lerp(a[6], b[6], t));
		if (portrait) {
			look.x *= 0.3;
			cpos.x *= 0.55;
			const f = clamp(1 + (1 - aspect) * 1.55, 1, 2.1);
			tmp.copy(cpos).sub(look).multiplyScalar(f);
			cpos.copy(look).add(tmp);
			const dy = tmp.length() * 0.11;
			look.y -= dy;
			cpos.y -= dy;
		}
		cpos.x += px * 0.35;
		cpos.y += py * 0.2;
		camera.position.copy(cpos);
		camera.lookAt(look);
	};

	const levels: HeroLevels = { grind: 0, pour: 0, esp: 0, water: 0 };
	let prevP = 0,
		spin = 0,
		lastT = 0;
	const espC = new THREE.Color(0x0b0402),
		amC = new THREE.Color(0x260b03);
	const fx = (n: string, i?: number) => opts.onFx && opts.onFx(n, i);

	const update = (p: number, t: number) => {
		const dt = Math.min(0.05, Math.max(0, t - lastT));
		lastT = t;
		px += (tpx - px) * 0.05;
		py += (tpy - py) * 0.05;
		const fwd = p > prevP && p - prevP < 0.2;
		/* bag + scissors */
		const cut = sg(p, 0.015, 0.065),
			tl = ease(sg(p, 0.07, 0.15)),
			ex = ease(sg(p, 0.21, 0.28));
		bag.visible = p < 0.29;
		bag.position.lerpVectors(BAG0, BAG1, tl);
		bag.position.x += ex * 3.2;
		bag.position.y += ex * 3.5 + Math.sin(t * 1.2) * 0.03 * (1 - tl);
		bag.rotation.set(0, (1 - tl) * -0.25, tl * 2.35 - ex * 1.2);
		bag.updateMatrixWorld();
		mouthW.copy(mouthLocal);
		bag.localToWorld(mouthW);
		scis.visible = p < 0.11;
		scis.position.set(lerp(-1.9, 1.5, cut), BAG0.y + 1.18 + sg(p, 0.065, 0.1) * 3, 0.48);
		scis.rotation.set(0, 0, sg(p, 0.065, 0.1) * 1.2);
		const op = cut > 0 && cut < 1 ? 0.08 + 0.3 * Math.abs(Math.sin(cut * Math.PI * 6)) : 0.32;
		sb1.rotation.z = op;
		sb2.rotation.z = -op;
		const fl = sg(p, 0.062, 0.13);
		seam.visible = p < 0.14;
		seam.position.set(BAG0.x + fl * 1.6, BAG0.y + 1.25 - fl * fl * 7, 0);
		seam.rotation.set(fl * 0.6, 0, -fl * 2.2);
		lid.rotation.x = -ease(sg(p, 0.06, 0.11)) * 1.15 + ease(sg(p, 0.22, 0.27)) * 1.15;
		/* pouring beans */
		let pourN = 0;
		const fill = lastFill < 0 ? 5.3 : lastFill;
		pbd.forEach((b, i) => {
			const u = sg(p, b.s, b.s + 0.035);
			const s = u > 0 && u < 1 ? 1 : 0;
			if (s) {
				pourN++;
				dum.position.set(lerp(mouthW.x + b.ox, b.tx, u), lerp(mouthW.y, fill + 0.05, u * u), lerp(mouthW.z + b.oz, b.tz, u));
				dum.rotation.set(b.r[0] + u * b.sp, b.r[1] + u * b.sp, b.r[2]);
			}
			dum.scale.setScalar(s);
			dum.updateMatrix();
			pb.setMatrixAt(i, dum.matrix);
		});
		pb.instanceMatrix.needsUpdate = true;
		setFill(5.25 + ease(sg(p, 0.1, 0.215)) * 1.12 - ease(sg(p, 0.3, 0.48)) * 0.32);
		/* panel + burrs */
		const open = ease(sg(p, 0.285, 0.36)) - ease(sg(p, 0.47, 0.53));
		if (portrait) {
			panel.position.set(0, 4.02 + open * 1.55, FZ + 0.045 + open * 0.65);
			panel.rotation.set(-open * 0.25, 0, 0);
		} else {
			panel.position.set(open * 2.3, 4.02, FZ + 0.045 + open * 0.38);
			panel.rotation.set(0, -open * 0.28, 0);
		}
		burr.position.set(0, 3.98, FZ - 0.75 + open * 0.88);
		burr.visible = open > 0.01;
		cav.visible = open > 0.01;
		burrLight.intensity = open * 1.6;
		const grinding = sg(p, 0.31, 0.33) * (1 - sg(p, 0.47, 0.49));
		spin += dt * (2 + grinding * 22);
		cone.rotation.y = spin;
		const dose = ease(sg(p, 0.32, 0.47)) * 18;
		drawScreen(p < 0.31 ? 'idle' : dose >= 17.95 ? 'done' : 'grind', dose);
		knob.rotation.x = -grinding * 0.4;
		gbd.forEach((b, i) => {
			const ph = (t * 0.9 + b.o) % 1;
			const s = grinding > 0.05 && open > 0.6 ? 1 - ph * 0.85 : 0;
			dum.position.set(b.x * (1 - ph), 4.48 - ph * 0.3, burr.position.z + 0.05);
			dum.rotation.set(b.r[0] + ph * 6, b.r[1] + ph * 4, 0);
			dum.scale.setScalar(s * 0.8);
			dum.updateMatrix();
			gb.setMatrixAt(i, dum.matrix);
		});
		gb.instanceMatrix.needsUpdate = true;
		gpm.opacity = grinding * 0.95;
		gpts.visible = grinding > 0;
		if (grinding > 0) {
			const half = NGP >> 1,
				bzz = burr.position.z + 0.1;
			for (let i = 0; i < NGP; i++) {
				const q = gpr[i],
					ph = (t * q.v + q.o) % 1;
				if (i < half) {
					const rr = 0.42 + q.r * 0.12;
					gpos[i * 3] = Math.cos(q.a + ph * 2) * rr * (1 - ph * 0.2);
					gpos[i * 3 + 1] = 3.76 - ph * 0.34;
					gpos[i * 3 + 2] = bzz + Math.sin(q.a) * 0.18;
				} else {
					gpos[i * 3] = Math.cos(q.a) * q.r * 0.09;
					gpos[i * 3 + 1] = lerp(2.98, 2.66, ph);
					gpos[i * 3 + 2] = 1.62 + Math.sin(q.a) * q.r * 0.09;
				}
			}
			gpg.attributes.position.needsUpdate = true;
		}
		/* portafilter travel */
		const m1 = ease(sg(p, 0.49, 0.53)),
			m2 = ease(sg(p, 0.53, 0.6)),
			m3 = ease(sg(p, 0.705, 0.75));
		PF.position.set(-m3 * 2.6, lerp(lerp(PF0.y, PF0.y + 0.15, m1), -4.55, m2) + m3 * 3, lerp(lerp(PF0.z, 2.7, m1), 0, m2));
		PF.rotation.set(0, -m2 * 1.2 + m3 * 0.4, 0);
		PF.visible = p < 0.8;
		mound.scale.set(1, 0.12 + ease(sg(p, 0.32, 0.47)) * 0.9, 1);
		mound.visible = p > 0.315 && p < 0.72;
		/* liquid */
		const h = ease(sg(p, 0.6, 0.7)) * 0.78 + ease(sg(p, 0.72, 0.87)) * 1.72;
		TB.setLevel(h);
		const mix = sg(p, 0.72, 0.9);
		TB.liqMat.color.copy(espC).lerp(amC, ease(mix));
		TB.liqMat.opacity = 0.97 - mix * 0.07;
		TB.liqMat.emissive.setHex(0x4a1503);
		TB.liqMat.emissiveIntensity = 0.08 + ease(mix) * 0.38;
		TB.crema.visible = h > 0.02;
		TB.crema.material.opacity = 0.92 - 0.55 * mix;
		TB.crema.material.color.setHex(mix > 0.3 ? 0x7a4a26 : 0x8a5a30);
		const surfY = GY + KIT.BASE + h;
		PF.updateMatrixWorld();
		const espOn = p > 0.6 && p < 0.705,
			esR = 0.03 * sg(p, 0.6, 0.61) * (1 - sg(p, 0.69, 0.705));
		spouts.forEach((s, k) => {
			s.getWorldPosition(tmp);
			stream(es[k], tmp.x + Math.sin(t * 9 + k) * 0.004, tmp.z, tmp.y - 0.06, surfY, espOn ? esR : 0);
		});
		const wOn = p > 0.72 && p < 0.87,
			wR = 0.055 * sg(p, 0.72, 0.735) * (1 - sg(p, 0.85, 0.87));
		stream(ws, 0.42 + Math.sin(t * 5) * 0.01, 0.05, -1.0, surfY, wOn ? wR : 0);
		/* ice */
		ice.forEach((c, i) => {
			const u = sg(p, c.s, c.s + 0.035);
			c.m.visible = p > c.s;
			const lift = Math.max(0, KIT.BASE + h - 1.95) * 1.05;
			const restY = Math.min(c.r[1] + lift, KIT.BASE + h - 0.1) + (h > 0.05 ? Math.sin(t * 1.1 + i) * 0.02 : 0);
			c.m.position.set(lerp(c.r[0] + c.sx, c.r[0], u), lerp(c.r[1] + 5.2 + i * 0.3, restY, u * u), lerp(c.r[2] + c.sz, c.r[2], u));
			c.m.rotation.set(c.rr[0] + (1 - u) * c.sp[0], c.rr[1] + (1 - u) * c.sp[1] + (h > 0.05 ? Math.sin(t * 0.4 + i) * 0.05 : 0), c.rr[2] + (1 - u) * c.sp[2]);
			const landed = u >= 1;
			if (landed && !c.landed && fwd) fx('clink', i);
			c.landed = landed;
		});
		/* finish */
		setDrops(ease(sg(p, 0.86, 0.97)));
		TB.glassMat.opacity = 0.2 + sg(p, 0.86, 0.97) * 0.08;
		glassG.rotation.y = sg(p, 0.88, 1) * (px * 0.9) + (opts.reduceMotion ? 0 : Math.sin(t * 0.5) * 0.5 * sg(p, 0.92, 1));
		cam(p);
		if (fwd) {
			if (prevP < 0.03 && p >= 0.03) fx('snip');
			if (prevP < 0.05 && p >= 0.05) fx('snip');
		}
		const pr = pourN / NP;
		levels.pour = pr > 0 ? Math.min(1, 0.35 + pr * 3) : 0;
		levels.grind = grinding * (open > 0.3 ? 1 : 0.55);
		levels.esp = espOn ? esR / 0.03 : 0;
		levels.water = wOn ? wR / 0.055 : 0;
		prevP = p;
		renderer.render(scene, camera);
	};

	const resize = () => {
		const w = canvas.clientWidth,
			h = canvas.clientHeight;
		if (!w || !h) return;
		renderer.setSize(w, h, false);
		aspect = w / h;
		portrait = aspect < 0.9;
		camera.aspect = aspect;
		camera.fov = portrait ? 42 : 38;
		camera.updateProjectionMatrix();
	};
	resize();

	return {
		update,
		resize,
		levels,
		setPointer: (x, y) => {
			tpx = x;
			tpy = y;
		},
		theme: (night) => {
			(scene.fog as THREE.Fog).color.setHex(night ? 0x06131f : 0x8fc4e2);
			hemi.intensity = night ? 0.55 : 0.95;
			key.intensity = night ? 1.5 : 1.9;
			rim.intensity = night ? 2.2 : 1;
		},
		dispose: () => {
			scene.traverse((o: any) => {
				if (o.geometry) o.geometry.dispose();
				if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: any) => m.dispose());
			});
			env.dispose();
			renderer.dispose();
		},
	};
}
