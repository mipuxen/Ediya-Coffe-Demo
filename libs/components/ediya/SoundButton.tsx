import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { soundOnVar } from '../../../apollo/store';
import { AU } from '../../ediya/sound';
import { toast } from './Toast';

/* Animated equalizer: bars move when sound is on, flat when off. Audio fades in/out (see libs/ediya/sound.ts). */
const SoundButton = ({ compact = false }: { compact?: boolean }) => {
	const { t } = useTranslation('common');
	const on = useReactiveVar(soundOnVar);
	const click = () => {
		const v = AU.toggle();
		soundOnVar(v);
		toast(t(v ? 'sound_on' : 'sound_off'));
	};
	return (
		<button className={`e-sound ${on ? 'on' : ''} ${compact ? 'compact' : ''}`} onClick={click} aria-pressed={on} aria-label={t('sound')}>
			<span className={'eq'} aria-hidden="true">
				<i />
				<i />
				<i />
				<i />
			</span>
			{!compact && <small>{t('sound')}</small>}
		</button>
	);
};

export default SoundButton;
