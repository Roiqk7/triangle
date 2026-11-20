import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { enemiesOf, planWave } from '../src/systems/waves/planWave';
import { runWaves } from '../src/systems/waves/runWaves';
import { spawnPoint } from '../src/systems/waves/spawnPoint';
import { ENTRANCES } from '../src/world/Wave';
import { createWorld, type World } from '../src/world/World';
import { seededRandom, STEP } from './helpers';

const { firstBreakSeconds, breakSeconds, scripted } = config.waves;

function run(world: World, seconds: number, seed = 1): void {
	const random = seededRandom(seed);
	for (let time = 0; time < seconds; time += STEP) runWaves(world, STEP, random);
}

/** Everything a wave asks the players to deal with. */
function featuresOf(number: number): Set<string> {
	const plan = planWave(number);
	const features = new Set<string>(enemiesOf(plan));
	if (plan.trains > 0) features.add('train');
	if (plan.powerup) features.add('powerup');
	return features;
}

describe('planWave', () => {
	it('opens with nothing but Chasers', () => {
		expect([...featuresOf(1)]).toEqual(['chaser']);
	});

	it('adds at most one new thing per scripted wave', () => {
		const seen = featuresOf(1);
		for (let number = 2; number <= scripted.length; number++) {
			const fresh = [...featuresOf(number)].filter(
				(feature) => !seen.has(feature),
			);
			expect(fresh.length).toBeLessThanOrEqual(1);
			fresh.forEach((feature) => seen.add(feature));
		}
		expect([...seen].sort()).toEqual(['brute', 'chaser', 'dasher', 'powerup', 'train']);
	});

	it('keeps growing after the scripted waves', () => {
		for (let number = scripted.length; number < scripted.length + 20; number++) {
			const now = enemiesOf(planWave(number)).length;
			const next = enemiesOf(planWave(number + 1)).length;
			expect(next).toBeGreaterThan(now);
		}
	});

	it('never lets arrivals come faster than the limit', () => {
		expect(planWave(500).spawnEvery).toBe(config.waves.endless.minSpawnEvery);
	});
});

describe('spawnPoint', () => {
	it.each(ENTRANCES)('is outside the %s wall', (entrance) => {
		const { width, height } = config.arena;
		const { x, y } = spawnPoint(entrance, seededRandom(3));
		expect(x >= 0 && x <= width && y >= 0 && y <= height).toBe(false);
	});
});

describe('runWaves', () => {
	it('lets nobody in during the opening break', () => {
		const world = createWorld();
		run(world, firstBreakSeconds - 0.5);

		expect(world.wave.phase).toBe('break');
		expect(world.enemies).toHaveLength(0);
	});

	it('lets the whole wave in, one at a time, through a single entrance', () => {
		const world = createWorld();
		const plan = planWave(1);
		const total = enemiesOf(plan).length;

		run(world, firstBreakSeconds + 0.1);
		expect(world.wave.phase).toBe('active');
		expect(world.enemies).toHaveLength(1);

		run(world, total * plan.spawnEvery);
		expect(world.enemies).toHaveLength(total);
		expect(world.wave.entrances).toHaveLength(1);
		const walls = new Set(
			world.enemies.map(
				(enemy) => `${enemy.position.x < 0}${enemy.position.y < 0}`,
			),
		);
		expect(walls.size).toBe(1);
	});

	it('starts a break once everyone is gone, then the next wave', () => {
		const world = createWorld();
		run(world, firstBreakSeconds + 20);
		expect(world.wave.number).toBe(1);

		world.enemies = [];
		run(world, STEP);
		expect(world.wave).toMatchObject({ number: 2, phase: 'break' });

		run(world, breakSeconds + 0.1);
		expect(world.wave.phase).toBe('active');
		expect(world.enemies.length).toBeGreaterThan(0);
	});

	it('does not end a wave while some of it has still to walk in', () => {
		const world = createWorld();
		run(world, firstBreakSeconds + 0.1);
		world.enemies = [];
		run(world, STEP);

		expect(world.wave).toMatchObject({ number: 1, phase: 'active' });
	});

	it('puts a power-up on the floor at the start of wave 2 but not wave 1', () => {
		const world = createWorld();
		run(world, firstBreakSeconds + 0.1);
		expect(world.powerups).toHaveLength(0);

		world.wave.queue = [];
		world.enemies = [];
		run(world, breakSeconds + 0.2);
		expect(world.wave.number).toBe(2);
		expect(world.powerups).toHaveLength(1);
	});

	it('announces a train during the first wave that has one', () => {
		const firstWithTrain = scripted.findIndex((plan) => plan.trains > 0) + 1;
		const world = createWorld();
		world.wave.number = firstWithTrain;

		run(world, firstBreakSeconds + 30);

		expect(world.train).not.toBeNull();
		expect(world.train?.warningLeft).toBe(config.train.warningSeconds);
	});
});
