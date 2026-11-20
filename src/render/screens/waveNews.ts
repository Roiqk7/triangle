/** What the board says before each of the opening waves: the one new thing to watch for. */
const news: readonly string[] = [
	'Homeless walk straight at you. Sweep a sanitizer stream through them.',
	'New: power-ups. Walk over one and the whole crew gets it.',
	'New: addicts. They stop, shake, then sprint along the dashed line.',
	'New: trains. When a track flashes red, get off it. Lure the others on.',
	'New: riot cops. Keep a stream on them until the bar runs out.',
];

const LATER_NEWS = 'More of everyone, from every door.';

export function newsForWave(number: number): string {
	return news[number - 1] ?? LATER_NEWS;
}
