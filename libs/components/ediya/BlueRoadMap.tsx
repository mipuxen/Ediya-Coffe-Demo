import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

const COURSES = [
	{ id: 'pa', d: 'M60 190 C120 150 190 170 230 150', c: '#ffd27a', k: 'rA', i: 'rAi' },
	{ id: 'pb', d: 'M230 150 C290 120 330 190 420 170', c: '#6fe3c1', k: 'rB', i: 'rBi' },
	{ id: 'pc', d: 'M420 170 C500 150 540 100 620 120', c: '#c9a6ff', k: 'rC', i: 'rCi' },
	{ id: 'pd', d: 'M620 120 C700 140 760 200 850 170', c: '#7fd0ff', k: 'rD', i: 'rDi' },
];
const STOPS = [
	{ x: 60, y: 190, tx: 40, ty: 218, k: 'Ganggu' },
	{ x: 230, y: 150, tx: 180, ty: 128, k: 'Changpo' },
	{ x: 420, y: 170, tx: 385, ty: 198, k: 'Chuksan' },
	{ x: 620, y: 120, tx: 595, ty: 98, k: 'Mogeun' },
	{ x: 850, y: 170, tx: 800, ty: 198, k: 'Goraebul' },
];

/* Schematic Blue Road with a little coffee walker following the 4 courses */
const BlueRoadMap = ({ compact = false }: { compact?: boolean }) => {
	const { t } = useTranslation('common');
	const [hi, setHi] = useState(-1);
	const svgRef = useRef<SVGSVGElement>(null);
	const walker = useRef<SVGCircleElement>(null);
	const cup = useRef<SVGTextElement>(null);

	useEffect(() => {
		const svg = svgRef.current;
		if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const paths = COURSES.map((c) => svg.querySelector('#' + c.id) as SVGPathElement);
		const lens = paths.map((p) => p.getTotalLength()),
			tot = lens.reduce((a, b) => a + b, 0);
		let raf = 0,
			vis = false;
		const f = (ms: number) => {
			if (!vis) return;
			raf = requestAnimationFrame(f);
			let d = ((ms / 1000) * 55) % tot,
				k = 0;
			while (d > lens[k] && k < 3) {
				d -= lens[k];
				k++;
			}
			const pt = paths[k].getPointAtLength(d);
			walker.current?.setAttribute('cx', String(pt.x));
			walker.current?.setAttribute('cy', String(pt.y));
			cup.current?.setAttribute('x', String(pt.x));
			cup.current?.setAttribute('y', String(pt.y - 14));
		};
		const io = new IntersectionObserver((es) => {
			vis = es[0].isIntersecting;
			cancelAnimationFrame(raf);
			if (vis) raf = requestAnimationFrame(f);
		});
		io.observe(svg);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<div className={`e-road ${compact ? 'compact' : ''}`}>
			<div className={'e-kick'}>{t('road_k')}</div>
			<h2>{t('road_h')}</h2>
			<p>{t('road_p')}</p>
			<svg ref={svgRef} className={'e-map'} viewBox="0 0 900 300" role="img" aria-label="Blue Road">
				<defs>
					<linearGradient id="sea" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="#0b4a78" />
						<stop offset="1" stopColor="#0a6aa0" />
					</linearGradient>
				</defs>
				<rect x="0" y="0" width="900" height="300" rx="20" fill="url(#sea)" opacity=".55" />
				<path d="M0 60 C140 30 220 100 340 70 S560 20 700 60 S840 40 900 50 L900 0 L0 0Z" fill="#e8d5b0" opacity=".28" />
				<g fill="none" strokeLinecap="round">
					{COURSES.map((c, i) => (
						<path key={c.id} id={c.id} d={c.d} stroke={c.c} strokeWidth={hi === i ? 10 : 7} opacity={hi < 0 || hi === i ? 1 : 0.35} />
					))}
				</g>
				<g fill="#fff" fontSize="13" fontFamily="Poppins,Pretendard,sans-serif">
					{STOPS.map((s) => (
						<g key={s.k}>
							<circle cx={s.x} cy={s.y} r="6" />
							<text x={s.tx} y={s.ty}>
								{t(s.k)}
							</text>
						</g>
					))}
				</g>
				<circle ref={walker} r="9" fill="#ff9d52" stroke="#fff" strokeWidth="3" cx="60" cy="190" />
				<text ref={cup} fontSize="16" textAnchor="middle" x="60" y="176">
					☕
				</text>
			</svg>
			<div className={'e-courses'}>
				{COURSES.map((c, i) => (
					<button key={c.id} className={hi === i ? 'on' : ''} onMouseEnter={() => setHi(i)} onFocus={() => setHi(i)} onClick={() => setHi(i)} style={{ ['--c' as any]: c.c }}>
						<b>{t(c.k)}</b>
						<span>{t(c.i)}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default BlueRoadMap;
