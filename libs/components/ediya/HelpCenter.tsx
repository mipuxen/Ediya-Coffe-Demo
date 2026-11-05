import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { HELP } from '../../data/help';

type Tab = 'guide' | 'faq';

const HelpCenter = () => {
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const tab: Tab = router.query.tab === 'faq' ? 'faq' : 'guide';
	const [open, setOpen] = useState<number>(0);
	const pack = HELP[i18n.language] ?? HELP.kr;

	const go = (next: Tab) => {
		setOpen(0);
		router.replace({ pathname: '/cs', query: { tab: next } }, undefined, { shallow: true, scroll: false });
	};

	return (
		<div id="e-help-page">
			<div className="container e-col">
				<div className={'e-tabs'} role="tablist">
					{(['guide', 'faq'] as Tab[]).map((k) => (
						<button key={k} role="tab" aria-selected={tab === k} className={`e-tab ${tab === k ? 'on' : ''}`} onClick={() => go(k)}>
							{t(`help_${k}`)}
						</button>
					))}
				</div>
				<div className={'e-acc'}>
					{pack[tab].map((it, i) => (
						<div className={`e-acc-item ${open === i ? 'on' : ''}`} key={it.q}>
							<button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
								<span>{it.q}</span>
								<i aria-hidden="true">{open === i ? '−' : '+'}</i>
							</button>
							{open === i && <p>{it.a}</p>}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HelpCenter;
