import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { readDirections } from '../src/input/playerInput';
import { length } from '../src/math/vec2';

function directionsFor(...heldCodes: string[]) {
	const held = new Set(heldCodes);
	return readDirections((code) => held.has(code), config.keys.players);
}

describe('readDirections', () => {
	it('gives every player a zero direction when nothing is held', () => {
		expect(directionsFor()).toEqual([
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
			{ x: 0, y: 0 },
		]);
	});

	it('moves each player with their own keys only', () => {
		const [p1, p2, p3] = directionsFor('KeyW', 'KeyL', 'ArrowDown');
		expect(p1).toEqual({ x: 0, y: -1 });
		expect(p2).toEqual({ x: 1, y: 0 });
		expect(p3).toEqual({ x: 0, y: 1 });
	});

	it('makes diagonal movement no faster than straight movement', () => {
		const [p1] = directionsFor('KeyW', 'KeyD');
		expect(length(p1)).toBeCloseTo(1);
		expect(p1.x).toBeGreaterThan(0);
		expect(p1.y).toBeLessThan(0);
	});

	it('cancels opposite keys', () => {
		const [p1] = directionsFor('KeyA', 'KeyD', 'KeyW');
		expect(p1).toEqual({ x: 0, y: -1 });
	});
});
