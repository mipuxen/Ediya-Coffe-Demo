/* Procedural sound for the Ediya site: sea/cafe ambience + effects synced to the hero animation.
   Nothing is created until the user presses the sound button; every level change ramps, so no clicks or pops. */
import { HeroLevels } from './constants';

type Bus = GainNode;

class Sound {
	ctx: AudioContext | null = null;
	on = false;
	private ready = false;
	private master!: GainNode;
	private amb!: Bus;
	private grindG!: Bus;
	private pourG!: Bus;
	private espG!: Bus;
	private waterG!: Bus;
	private noiseBuf!: AudioBuffer;
	private cur: HeroLevels = { grind: 0, pour: 0, esp: 0, water: 0 };
	private susTimer: any = null;

	private init() {
		const C = (window as any).AudioContext || (window as any).webkitAudioContext;
		if (!C) return false;
		const c: AudioContext = (this.ctx = new C());
		const comp = c.createDynamicsCompressor();
		comp.threshold.value = -18;
		comp.ratio.value = 3;
		comp.connect(c.destination);
		this.master = c.createGain();
		this.master.gain.value = 0;
		this.master.connect(comp);
		const len = c.sampleRate * 3,
			buf = c.createBuffer(1, len, c.sampleRate),
			d = buf.getChannelData(0);
		let b0 = 0,
			b1 = 0,
			b2 = 0;
		for (let i = 0; i < len; i++) {
			const w = Math.random() * 2 - 1;
			b0 = 0.99765 * b0 + w * 0.099;
			b1 = 0.963 * b1 + w * 0.2965;
			b2 = 0.57 * b2 + w * 1.0526;
			d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
		}
		this.noiseBuf = buf;
		const noise = () => {
			const s = c.createBufferSource();
			s.buffer = buf;
			s.loop = true;
			s.start(0, Math.random() * 2);
			return s;
		};
		const filt = (type: BiquadFilterType, f: number, q = 0.7) => {
			const x = c.createBiquadFilter();
			x.type = type;
			x.frequency.value = f;
			x.Q.value = q;
			return x;
		};
		const gain = (v: number) => {
			const g = c.createGain();
			g.gain.value = v;
			return g;
		};
		const lfo = (hz: number, depth: number, target: AudioParam) => {
			const o = c.createOscillator(),
				g = gain(depth);
			o.frequency.value = hz;
			o.connect(g);
			g.connect(target);
			o.start();
		};
		const chain = (...nodes: AudioNode[]) => {
			for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]);
		};
		/* ambience: sea swell (2 layers) + low cafe room tone */
		this.amb = gain(0);
		this.amb.connect(this.master);
		const w1 = gain(0.16);
		chain(noise(), filt('lowpass', 420, 0.5), w1, this.amb);
		lfo(0.085, 0.13, w1.gain);
		const w2 = gain(0.05);
		chain(noise(), filt('bandpass', 1500, 0.6), w2, this.amb);
		lfo(0.11, 0.045, w2.gain);
		chain(noise(), filt('lowpass', 180, 0.4), gain(0.06), this.amb);
		/* grinder: motor hum + burr crunch */
		this.grindG = gain(0);
		this.grindG.connect(this.master);
		const m1 = c.createOscillator();
		m1.type = 'sawtooth';
		m1.frequency.value = 98;
		const m2 = c.createOscillator();
		m2.type = 'square';
		m2.frequency.value = 49;
		const mf = filt('lowpass', 700, 0.8);
		m1.connect(mf);
		m2.connect(mf);
		chain(mf, gain(0.07), this.grindG);
		m1.start();
		m2.start();
		lfo(5.5, 3, m1.frequency);
		const crunch = gain(0.28);
		chain(noise(), filt('bandpass', 2600, 1.4), crunch, this.grindG);
		lfo(13, 0.12, crunch.gain);
		lfo(7.3, 0.08, crunch.gain);
		/* bean pour rattle */
		this.pourG = gain(0);
		this.pourG.connect(this.master);
		const rt = gain(0.4);
		chain(noise(), filt('highpass', 2200), rt, this.pourG);
		lfo(23, 0.3, rt.gain);
		lfo(17, 0.2, rt.gain);
		/* espresso trickle */
		this.espG = gain(0);
		this.espG.connect(this.master);
		const ef = filt('bandpass', 650, 4);
		chain(noise(), ef, gain(0.9), this.espG);
		lfo(3.2, 140, ef.frequency);
		/* water pour */
		this.waterG = gain(0);
		this.waterG.connect(this.master);
		const wf = filt('bandpass', 950, 0.9);
		chain(noise(), wf, gain(0.8), this.waterG);
		lfo(6.5, 260, wf.frequency);
		chain(noise(), filt('lowpass', 300), gain(0.35), this.waterG);
		this.ready = true;
		const clink = () => {
			if (this.on && !document.hidden) this.cup();
			setTimeout(clink, 7000 + Math.random() * 9000);
		};
		setTimeout(clink, 5000);
		document.addEventListener('visibilitychange', () => {
			if (this.on) this.ramp(this.master.gain, document.hidden ? 0 : 0.85, 0.2);
		});
		return true;
	}

	private ramp(p: AudioParam, v: number, tc = 0.12) {
		if (this.ctx) p.setTargetAtTime(v, this.ctx.currentTime, tc);
	}

	toggle(): boolean {
		if (!this.ctx && !this.init()) return false;
		const ctx = this.ctx!;
		this.on = !this.on;
		if (this.on) {
			clearTimeout(this.susTimer);
			const go = () => {
				this.ramp(this.master.gain, 0.85, 0.5);
				this.ramp(this.amb.gain, 1, 1.2);
			};
			if (ctx.state === 'suspended') ctx.resume().then(go);
			else go();
		} else {
			this.ramp(this.master.gain, 0, 0.18);
			this.susTimer = setTimeout(() => {
				if (!this.on && ctx.state === 'running') ctx.suspend();
			}, 1400);
		}
		return this.on;
	}

	levels(s: HeroLevels, visible: boolean) {
		if (!this.on || !this.ready) return;
		const v = visible ? 1 : 0;
		const set = (k: keyof HeroLevels, node: GainNode, val: number, mul: number, tc: number) => {
			const x = val * v * mul;
			if (Math.abs(x - this.cur[k]) < 0.01) return;
			this.cur[k] = x;
			this.ramp(node.gain, x, tc);
		};
		set('grind', this.grindG, s.grind, 0.55, 0.15);
		set('pour', this.pourG, s.pour, 0.35, 0.08);
		set('esp', this.espG, s.esp, 0.5, 0.1);
		set('water', this.waterG, s.water, 0.45, 0.12);
	}

	private env(o: AudioScheduledSourceNode, g: GainNode, t: number, a: number, dec: number, peak: number) {
		g.gain.setValueAtTime(0.0001, t);
		g.gain.exponentialRampToValueAtTime(peak, t + a);
		g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
		o.start(t);
		o.stop(t + a + dec + 0.02);
	}
	private tone(f: number, dec: number, peak: number, type: OscillatorType = 'sine') {
		const c = this.ctx!,
			o = c.createOscillator(),
			g = c.createGain();
		o.type = type;
		o.frequency.value = f;
		o.connect(g);
		g.connect(this.master);
		this.env(o, g, c.currentTime, 0.004, dec, peak);
	}
	private burst(dec: number, peak: number, type: BiquadFilterType, f: number, q = 1, delay = 0) {
		const c = this.ctx!,
			t = c.currentTime + delay,
			s = c.createBufferSource(),
			fl = c.createBiquadFilter(),
			g = c.createGain();
		s.buffer = this.noiseBuf;
		fl.type = type;
		fl.frequency.value = f;
		fl.Q.value = q;
		s.connect(fl);
		fl.connect(g);
		g.connect(this.master);
		g.gain.setValueAtTime(0.0001, t);
		g.gain.exponentialRampToValueAtTime(peak, t + 0.003);
		g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
		s.start(t, Math.random() * 2);
		s.stop(t + dec + 0.02);
	}
	private cup() {
		const f = 2200 + Math.random() * 500;
		this.tone(f, 0.5, 0.025);
		this.tone(f * 1.52, 0.35, 0.012);
	}
	fx(name: string, i = 0) {
		if (!this.on || !this.ready || this.ctx!.state !== 'running') return;
		if (name === 'clink') {
			const f = 1900 + (i % 4) * 260 + Math.random() * 120;
			this.tone(f, 0.32, 0.12);
			this.tone(f * 2.76, 0.18, 0.05);
			this.tone(f * 0.5, 0.12, 0.05, 'triangle');
			this.burst(0.04, 0.08, 'highpass', 4000);
		} else if (name === 'snip') {
			this.burst(0.05, 0.22, 'highpass', 3500, 0.8);
			this.burst(0.035, 0.14, 'bandpass', 6000, 2, 0.06);
		} else if (name === 'tick') {
			this.tone(1150, 0.05, 0.05);
			this.burst(0.02, 0.03, 'highpass', 5000);
		} else if (name === 'add') {
			const c = this.ctx!,
				t = c.currentTime,
				o = c.createOscillator(),
				g = c.createGain();
			o.frequency.setValueAtTime(520, t);
			o.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
			o.connect(g);
			g.connect(this.master);
			this.env(o, g, t, 0.008, 0.22, 0.14);
		}
	}
}

export const AU = new Sound();
