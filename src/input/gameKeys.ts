import { config } from '../config';

/** Every key code the game reacts to. */
export function gameKeys(): Set<string> {
	const { players, start, pause, debug } = config.keys;
	const movement = players.flatMap((keys) => [keys.up, keys.left, keys.down, keys.right]);
	return new Set([...movement, ...start, pause, debug]);
}
