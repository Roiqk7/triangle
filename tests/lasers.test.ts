import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { removeWashedEnemies } from '../src/systems/removeWashedEnemies';
import { updateLasers } from '../src/systems/updateLasers';
import { createWorld, type World } from '../src/world/World';
import { addEnemy, midpoint, neverSpawn, STEP } from './helpers';

function soak(world: World, seconds: number): void {
	for (let time = 0; time < seconds; time += STEP) {
		updateLasers(world, STEP);
		removeWashedEnemies(world, neverSpawn);
	}
}

/** Moves player 1 so that its laser to player 3 is `factor` times the max length. */
function stretchP1ToP3(world: World, factor: number): void {
	const [p1, , p3] = world.players;
	p1.position = { x: p3.position.x - config.laser.maxLength * factor, y: p3.position.y };
}

const P1_TO_P3 = 1;

describe('lasers and enemies', () => {
	it('joins every pair of players with an active laser at the start', () => {
		const world = createWorld();
		updateLasers(world, STEP);

		expect(world.lasers).toHaveLength(3);
		expect(world.lasers.every((laser) => laser.active)).toBe(true);
	});

	it('removes a Chaser that touches a laser and counts it', () => {
		const world = createWorld();
		const [p1, , p3] = world.players;
		addEnemy(world, 'chaser', midpoint(p1.position, p3.position));

		soak(world, STEP);

		expect(world.enemies).toHaveLength(0);
		expect(world.kills).toBe(1);
	});

	it('leaves an enemy alone when it is away from every laser', () => {
		const world = createWorld();
		const chaser = addEnemy(world, 'chaser', { x: 50, y: 50 });

		soak(world, STEP);

		expect(chaser.hp).toBe(chaser.maxHp);
	});

	it('needs sustained contact to remove a Brute', () => {
		const world = createWorld();
		const [p1, , p3] = world.players;
		const brute = addEnemy(world, 'brute', midpoint(p1.position, p3.position));

		soak(world, STEP);
		expect(world.enemies).toHaveLength(1);
		expect(brute.hp).toBeLessThan(brute.maxHp);

		soak(world, config.enemies.brute.hp / config.laser.damagePerSecond);
		expect(world.enemies).toHaveLength(0);
	});
});

describe('laser tension', () => {
	it('reports how stretched a laser is', () => {
		const world = createWorld();
		updateLasers(world, STEP);

		const expected = config.player.startTriangleSide / config.laser.maxLength;
		expect(world.lasers[P1_TO_P3].strain).toBeCloseTo(expected);
	});

	it('keeps working for a while beyond its max length, then snaps', () => {
		const world = createWorld();
		stretchP1ToP3(world, 1.15);

		soak(world, config.laser.snapSeconds / 2);
		expect(world.lasers[P1_TO_P3].active).toBe(true);
		expect(world.lasers[P1_TO_P3].overstretch).toBeGreaterThan(0);

		soak(world, config.laser.snapSeconds);
		expect(world.lasers[P1_TO_P3].snapped).toBe(true);
		expect(world.lasers[P1_TO_P3].active).toBe(false);
	});

	it('stays snapped while too long and works again once back in range', () => {
		const world = createWorld();
		stretchP1ToP3(world, 1.15);
		soak(world, config.laser.snapSeconds * 2);
		expect(world.lasers[P1_TO_P3].active).toBe(false);

		stretchP1ToP3(world, 0.9);
		soak(world, STEP);
		expect(world.lasers[P1_TO_P3].active).toBe(true);
	});

	it('forgets the overstretch gradually once back in range', () => {
		const world = createWorld();
		stretchP1ToP3(world, 1.15);
		soak(world, config.laser.snapSeconds / 2);
		const built = world.lasers[P1_TO_P3].overstretch;

		stretchP1ToP3(world, 0.9);
		soak(world, STEP);
		expect(world.lasers[P1_TO_P3].overstretch).toBeLessThan(built);
		expect(world.lasers[P1_TO_P3].overstretch).toBeGreaterThan(0);

		soak(world, config.laser.snapSeconds);
		expect(world.lasers[P1_TO_P3].overstretch).toBe(0);
	});

	it('snaps at once when stretched absurdly far', () => {
		const world = createWorld();
		stretchP1ToP3(world, config.laser.snapLengthFactor + 0.1);

		soak(world, STEP);

		expect(world.lasers[P1_TO_P3].active).toBe(false);
	});

	it('does no damage once snapped', () => {
		const world = createWorld();
		stretchP1ToP3(world, 1.15);
		soak(world, config.laser.snapSeconds * 2);
		const [p1, , p3] = world.players;
		const chaser = addEnemy(world, 'chaser', midpoint(p1.position, p3.position));

		soak(world, STEP);

		expect(chaser.hp).toBe(chaser.maxHp);
	});
});
