import { describe, expect, it } from 'vitest';
import { step } from '../src/systems/step';
import { createWorld } from '../src/world/World';
import { addEnemy, neverSpawn, NO_MOVEMENT, STEP } from './helpers';

describe('step', () => {
	it('ends the run when an enemy touches a player away from the lasers', () => {
		const world = createWorld();
		const top = world.players[1].position;
		// Straight above the top player: outside the triangle, so no laser is in the way.
		addEnemy(world, 'chaser', { x: top.x, y: top.y - 20 });

		step(world, NO_MOVEMENT, STEP, neverSpawn);

		expect(world.over).toBe(true);
	});

	it('lets the laser win when an enemy reaches a laser and a player in the same step', () => {
		const world = createWorld();
		const [p1, , p3] = world.players;
		// On the laser between P1 and P3, and overlapping P1.
		addEnemy(world, 'chaser', { x: p1.position.x + 10, y: p3.position.y });

		step(world, NO_MOVEMENT, STEP, neverSpawn);

		expect(world.kills).toBe(1);
		expect(world.over).toBe(false);
	});

	it('advances the clock', () => {
		const world = createWorld();
		step(world, NO_MOVEMENT, STEP, neverSpawn);
		expect(world.time).toBeCloseTo(STEP);
	});
});
