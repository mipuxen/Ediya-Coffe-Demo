/* 3D drink viewer for the menu detail page: tumbler (with frosted EDIYA COFFEE), ice, cream, steam, or an ice-cream cup */
import * as THREE from 'three';
import * as KIT from './kit';
import { MenuItem, Size, Temp } from '../types/menu/menu';

export interface GlassViewer {
	show: (it: MenuItem, size: Size, temp: Temp) => void;
	resize: () => void;
	dispose: () => void;
}

export function createGlassViewer(canvas: HTMLCanvasElement, mobile: boolean, reduceMotion: boolean): GlassViewer {
	const r = KIT.makeRenderer(canvas, mobile);
	const env = KIT.makeEnv(r);
	const s = new THREE.Scene();
	s.environment = env;
	const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
	cam.position.set(0, 2.4, 8.2);
	cam.lookAt(0, 1.55, 0);
	s.add(new THREE.HemisphereLight(0xdff2ff, 0x0a1622, 0.45));
	const k = new THREE.DirectionalLight(0xffffff, 1.1);
	k.position.set(4, 6, 6);
	s.add(k);
	const rim = new THREE.PointLight(0x4ec3ff, 1.6, 20);
	rim.position.set(-4, 2, -2);
	s.add(rim);
	const TB = KIT.tumbler(env, mobile);
	const g = TB.group;
	s.add(g);
	const cup = new THREE.Mesh(
		new THREE.LatheGeometry(
			[
				[0.001, 0],
				[0.62, 0],
				[0.66, 0.04],
				[0.8, 0.95],
				[0.84, 1.0],
				[0.78, 1.0],
				[0.6, 0.06],
				[0.001, 0.06],
			].map((v) => new THREE.Vector2(v[0], v[1])),
			48,
		),
		new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, clearcoat: 0.5 }),
	);
	s.add(cup);
	const scoop = new THREE.Group();
	s.add(scoop);
	const scoopMat = new THREE.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 0.75 });
	for (let i = 0; i < 4; i++) {
		const m = new THREE.Mesh(new THREE.SphereGeometry(0.62 - i * 0.13, 28, 16), scoopMat);
		m.position.y = 1.02 + i * 0.36;
		m.scale.y = 0.75;
		scoop.add(m);
	}
	const tip = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 20), scoopMat);
	tip.position.y = 2.5;
	scoop.add(tip);
	const cream = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }));
	g.add(cream);
	const igeo = KIT.iceGeo(0.46),
		im = new THREE.MeshPhysicalMaterial({ color: 0xeaf7ff, roughness: 0.06, clearcoat: 1, transparent: true, opacity: 0.5 });
	const ICE = [
		[-0.26, 0.55, 0.12],
		[0.26, 0.6, -0.1],
		[0, 0.6, 0.32],
		[0, 1.08, -0.22],
		[-0.2, 1.15, 0.2],
		[0.25, 1.12, 0.16],
		[0.03, 1.6, 0],
	];
	const ice = ICE.map((p) => {
		const m = new THREE.Mesh(igeo, im);
		m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
		m.renderOrder = 2;
		g.add(m);
		return m;
	});
	const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.8, 12), new THREE.MeshStandardMaterial({ color: 0x4ec3ff, roughness: 0.4 }));
	straw.position.set(0.32, 2.2, 0);
	straw.rotation.z = -0.13;
	g.add(straw);
	const steam = Array.from({ length: 4 }, (_, i) => {
		const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.9), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
		s.add(m);
		return { m, x: (i - 1.5) * 0.32, ph: i * 0.7 };
	});
	let it: MenuItem | null = null,
		temp: Temp = 'ice',
		t0 = performance.now(),
		rot = 0,
		raf = 0,
		drag = false,
		lx = 0;
	const down = (e: PointerEvent) => {
		drag = true;
		lx = e.clientX;
	};
	const up = () => (drag = false);
	const move = (e: PointerEvent) => {
		if (!drag) return;
		rot += (e.clientX - lx) * 0.012;
		lx = e.clientX;
	};
	canvas.addEventListener('pointerdown', down);
	window.addEventListener('pointerup', up);
	canvas.addEventListener('pointermove', move);

	const loop = () => {
		raf = requestAnimationFrame(loop);
		if (!it) return;
		const t = (performance.now() - t0) / 1000,
			f = Math.min(1, t / 1.5),
			e = f * f * (3 - 2 * f);
		const full = (KIT.GH - KIT.BASE - 0.32) * e;
		TB.setLevel(full);
		const top = KIT.BASE + full;
		const cr = (KIT.rIn(top) - 0.02) / 0.9;
		cream.position.y = top;
		cream.scale.set(cr, 0.55 * e, cr);
		const lift = Math.max(0, top - 1.95) * 1.05;
		ice.forEach((m, i) => {
			const p = ICE[i];
			m.position.set(p[0] + Math.sin(t * 0.7 + i) * 0.03, Math.min(p[1] + lift, top - 0.08) + Math.sin(t * 0.9 + i) * 0.02, p[2]);
		});
		scoop.scale.setScalar(0.2 + 0.8 * e);
		if (!reduceMotion && !drag) rot += 0.004;
		g.rotation.y = rot;
		cup.rotation.y = scoop.rotation.y = rot;
		steam.forEach((o) => {
			const p = ((t * 0.35 + o.ph) % 2) / 2;
			o.m.position.set(o.x, top + 0.3 + p * 1.5, 0.3);
			(o.m.material as THREE.MeshBasicMaterial).opacity = temp === 'hot' ? 0.2 * (1 - p) * e : 0;
			o.m.scale.set(1 + p, 1 + p, 1);
			o.m.lookAt(cam.position);
		});
		r.render(s, cam);
	};
	const resize = () => {
		const w = canvas.clientWidth,
			h = canvas.clientHeight;
		if (!w || !h) return;
		r.setSize(w, h, false);
		cam.aspect = w / h;
		cam.position.set(0, 2.4, w / h < 0.9 ? 9.6 : 8.2);
		cam.lookAt(0, 1.55, 0);
		cam.updateProjectionMatrix();
	};
	resize();
	raf = requestAnimationFrame(loop);

	return {
		resize,
		show: (item, size, tp) => {
			const changedItem = !it || it.id !== item.id;
			it = item;
			temp = tp;
			if (changedItem) t0 = performance.now();
			const sf = item.cat === 'sf',
				hot = tp === 'hot';
			g.visible = !sf;
			cup.visible = sf;
			scoop.visible = sf;
			TB.liqMat.color.setStyle(item.c1);
			TB.liqMat.emissive.setHex(0x000000);
			TB.liqMat.opacity = 0.95;
			TB.crema.material.color.setStyle(item.c2 || item.c1);
			TB.crema.material.opacity = item.c2 ? 0.95 : 0;
			cream.visible = item.top !== 'n' && !sf;
			cream.material.color.setHex(item.top === 'f' ? 0xfff4e0 : 0xffffff);
			ice.forEach((m) => (m.visible = !hot));
			straw.visible = !hot && !sf;
			if (sf && item.c2) scoopMat.color.setStyle(item.c2);
			else scoopMat.color.setHex(0xf6f6f2);
			const big = size === 'E';
			g.scale.set(big ? 1.05 : 1, big ? 1.12 : 1, big ? 1.05 : 1);
		},
		dispose: () => {
			cancelAnimationFrame(raf);
			canvas.removeEventListener('pointerdown', down);
			window.removeEventListener('pointerup', up);
			canvas.removeEventListener('pointermove', move);
			s.traverse((o: any) => {
				if (o.geometry) o.geometry.dispose();
				if (o.material) o.material.dispose();
			});
			env.dispose();
			r.dispose();
		},
	};
}
