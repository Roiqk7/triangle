import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { ZERO } from '../src/math/vec2';
import { movePlayers } from '../src/systems/movePlayers';
import { createWorld } from '../src/world/World';

describe('movePlayers', () => {
	it('moves a player at the configured speed', () => {
		const world = createWorld();
		const startX = world.players[0].position.x;

		movePlayers(world, [{ x: 1, y: 0 }, ZERO, ZERO], 0.5);

		expect(world.players[0].position.x).toBeCloseTo(startX + config.player.speed * 0.5);
	});

	it('keeps players inside the arena', () => {
		const world = createWorld();
		const up = { x: 0, y: -1 };
		const right = { x: 1, y: 0 };

		movePlayers(world, [up, right, ZERO], 60);

		expect(world.players[0].position.y).toBe(config.player.radius);
		expect(world.players[1].position.x).toBe(config.arena.width - config.player.radius);
	});
});
