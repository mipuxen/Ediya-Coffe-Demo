import React, { useEffect, useState } from 'react';

/* tiny global toast: call toast('text') from anywhere */
type L = (m: string) => void;
let listener: L | null = null;
export const toast = (m: string) => listener && listener(m);

const Toast = () => {
	const [msg, setMsg] = useState('');
	const [on, setOn] = useState(false);
	useEffect(() => {
		let h: any;
		listener = (m) => {
			setMsg(m);
			setOn(true);
			clearTimeout(h);
			h = setTimeout(() => setOn(false), 2600);
		};
		return () => {
			listener = null;
			clearTimeout(h);
		};
	}, []);
	return (
		<div className={`e-toast ${on ? 'on' : ''}`} role="status">
			{msg}
		</div>
	);
};

export default Toast;
