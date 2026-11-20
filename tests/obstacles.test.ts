import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { distance, ZERO } from '../src/math/vec2';
import { movePlayers } from '../src/systems/movePlayers';
import { step } from '../src/systems/step';
import { buildLasers } from '../src/systems/buildLasers';
import { updateLasers } from '../src/systems/updateLasers';
import { generateObstacles } from '../src/world/generateObstacles';
import type { Obstacle } from '../src/world/Obstacle';
import { createWorld } from '../src/world/World';
import { addEnemy, midpoint, neverSpawn, NO_MOVEMENT, seededRandom, STEP } from './helpers';

const SEEDS = Array.from({ length: 25 }, (_, index) => index + 1);
const TOLERANCE = 1e-6;

describe('generateObstacles', () => {
	const settings = config.obstacles;
	const center = { x: config.arena.width / 2, y: config.arena.height / 2 };

	it.each(SEEDS)('places pillars that follow every placement rule (seed %i)', (seed) => {
		const obstacles = generateObstacles(seededRandom(seed));

		expect(obstacles.length).toBeGreaterThan(0);
		expect(obstacles.length).toBeLessThanOrEqual(settings.count);

		for (const { position, radius } of obstacles) {
			const reach = radius + settings.edgeMargin;
			expect(position.x).toBeGreaterThanOrEqual(reach);
			expect(position.x).toBeLessThanOrEqual(config.arena.width - reach);
			expect(position.y).toBeGreaterThanOrEqual(reach);
			expect(position.y).toBeLessThanOrEqual(config.arena.height - reach);
			expect(distance(position, center) - radius).toBeGreaterThanOrEqual(
				settings.clearCenterRadius,
			);
		}
		for (const { position, radius } of obstacles) {
			for (const trackX of config.train.trackXs) {
				const clearOfLane = Math.abs(position.x - trackX) - radius;
				expect(clearOfLane).toBeGreaterThanOrEqual(
					config.train.laneHalfWidth,
				);
			}
		}
		for (const a of obstacles) {
			for (const b of obstacles) {
				if (a === b) continue;
				const gap = distance(a.position, b.position) - a.radius - b.radius;
				expect(gap).toBeGreaterThanOrEqual(settings.minGap);
			}
		}
	});

	it.each(SEEDS)('never blocks a laser at the start of a run (seed %i)', (seed) => {
		const obstacles = generateObstacles(seededRandom(seed));
		const lasers = buildLasers(createWorld(obstacles).players, obstacles);

		expect(lasers.every((laser) => laser.active)).toBe(true);
	});

	it('gives different layouts for different seeds', () => {
		const first = generateObstacles(seededRandom(1));
		const second = generateObstacles(seededRandom(2));
		expect(first).not.toEqual(second);
	});
});

describe('a pillar between two players', () => {
	function worldWithPillarBetweenP1AndP3() {
		const open = createWorld();
		const [p1, , p3] = open.players;
		const pillar: Obstacle = {
			position: midpoint(p1.position, p3.position),
			radius: 30,
		};
		return createWorld([pillar]);
	}

	it('cuts only the laser that passes through it', () => {
		const world = worldWithPillarBetweenP1AndP3();
		updateLasers(world, STEP);

		const blocked = world.lasers.filter((laser) => laser.blocked);
		expect(blocked).toHaveLength(1);
		expect(blocked[0].active).toBe(false);
		expect(world.lasers.filter((laser) => laser.active)).toHaveLength(2);
	});

	it('stops the cut laser from damaging enemies', () => {
		const world = worldWithPillarBetweenP1AndP3();
		const [p1, , p3] = world.players;
		const quarterWay = midpoint(p1.position, midpoint(p1.position, p3.position));
		const chaser = addEnemy(world, 'chaser', quarterWay);

		updateLasers(world, STEP);

		expect(chaser.hp).toBe(chaser.maxHp);
	});
});

describe('moving near a pillar', () => {
	it('stops a player who walks straight into a pillar', () => {
		const start = createWorld().players[0].position;
		const pillar: Obstacle = { position: { x: start.x + 100, y: start.y }, radius: 40 };
		const world = createWorld([pillar]);
		const player = world.players[0];

		for (let time = 0; time < 2; time += STEP) {
			movePlayers(world, [{ x: 1, y: 0 }, ZERO, ZERO], STEP);
		}

		const gap =
			distance(player.position, pillar.position) - pillar.radius - player.radius;
		expect(gap).toBeGreaterThanOrEqual(-TOLERANCE);
		expect(player.position.x).toBeLessThan(pillar.position.x);
	});

	it('lets a player slide around a pillar hit off-centre', () => {
		const start = createWorld().players[0].position;
		const pillar: Obstacle = {
			position: { x: start.x + 100, y: start.y + 10 },
			radius: 40,
		};
		const world = createWorld([pillar]);

		for (let time = 0; time < 3; time += STEP) {
			movePlayers(world, [{ x: 1, y: 0 }, ZERO, ZERO], STEP);
		}

		expect(world.players[0].position.x).toBeGreaterThan(
			pillar.position.x + pillar.radius,
		);
	});

	it('makes an enemy go around a pillar to reach its target', () => {
		const top = createWorld().players[1].position;
		const pillar: Obstacle = { position: { x: top.x, y: top.y - 130 }, radius: 40 };
		const world = createWorld([pillar]);
		const chaser = addEnemy(world, 'chaser', { x: top.x + 5, y: top.y - 240 });

		let closestToPillar = Infinity;
		while (!world.over && world.time < 20) {
			step(world, NO_MOVEMENT, STEP, neverSpawn);
			closestToPillar = Math.min(
				closestToPillar,
				distance(chaser.position, pillar.position),
			);
		}

		expect(world.over).toBe(true);
		expect(closestToPillar).toBeGreaterThanOrEqual(
			pillar.radius + chaser.radius - TOLERANCE,
		);
	});
});
