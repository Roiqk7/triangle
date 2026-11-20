export interface PlayerKeys {
	readonly up: string;
	readonly left: string;
	readonly down: string;
	readonly right: string;
	/** Shown on the title screen. */
	readonly label: string;
}

/** Key codes are physical positions (KeyboardEvent.code), so they work on any layout. */
const players: readonly PlayerKeys[] = [
	{ up: 'KeyW', left: 'KeyA', down: 'KeyS', right: 'KeyD', label: 'W A S D' },
	{ up: 'KeyI', left: 'KeyJ', down: 'KeyK', right: 'KeyL', label: 'I J K L' },
	{
		up: 'ArrowUp',
		left: 'ArrowLeft',
		down: 'ArrowDown',
		right: 'ArrowRight',
		label: '← ↑ ↓ →',
	},
];

const start: readonly string[] = ['Enter', 'Space'];

export const keys = { players, start, pause: 'KeyP', debug: 'Backquote' };
