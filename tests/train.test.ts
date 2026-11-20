import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { announceTrain, updateTrain } from '../src/systems/updateTrain';
import { createWorld, type World } from '../src/world/World';
import { addEnemy, seededRandom, STEP } from './helpers';

const { warningSeconds, trackXs, laneHalfWidth, speed, length } = config.train;

function worldWithTrain(): World {
	const world = createWorld();
	announceTrain(world, seededRandom(1));
	return world;
}

function run(world: World, seconds: number): void {
	for (let time = 0; time < seconds; time += STEP) updateTrain(world, STEP);
}

/** Long enough for the train to finish its warning and cross the whole hall. */
const FULL_PASS = warningSeconds + (config.arena.height + length) / speed + 0.5;

describe('train', () => {
	it('is announced on one of the tracks with a full warning', () => {
		const world = worldWithTrain();

		expect(trackXs).toContain(world.train?.trackX);
		expect(world.train?.warningLeft).toBe(warningSeconds);
	});

	it('hurts nobody while it is only a warning', () => {
		const world = worldWithTrain();
		const trackX = world.train?.trackX ?? 0;
		world.players[0].position = { x: trackX, y: 450 };
		const chaser = addEnemy(world, 'chaser', { x: trackX, y: 300 });

		run(world, warningSeconds - 0.2);

		expect(world.over).toBe(false);
		expect(chaser.hp).toBe(chaser.maxHp);
	});

	it('catches a player standing on its track', () => {
		const world = worldWithTrain();
		world.players[2].position = { x: world.train?.trackX ?? 0, y: 450 };

		run(world, FULL_PASS);

		expect(world.over).toBe(true);
		expect(world.caught).toBe(2);
	});

	it('takes out every enemy on its track, even a Brute', () => {
		const world = worldWithTrain();
		const trackX = world.train?.trackX ?? 0;
		const chaser = addEnemy(world, 'chaser', { x: trackX, y: 200 });
		const brute = addEnemy(world, 'brute', { x: trackX + 20, y: 700 });

		run(world, FULL_PASS);

		expect(chaser.hp).toBeLessThanOrEqual(0);
		expect(brute.hp).toBeLessThanOrEqual(0);
	});

	it('misses anyone standing clear of the track', () => {
		const world = worldWithTrain();
		const trackX = world.train?.trackX ?? 0;
		const clear = trackX + laneHalfWidth + config.player.radius + 5;
		world.players[0].position = { x: clear, y: 450 };
		const chaser = addEnemy(world, 'chaser', {
			x: trackX - laneHalfWidth - 40,
			y: 450,
		});

		run(world, FULL_PASS);

		expect(world.over).toBe(false);
		expect(chaser.hp).toBe(chaser.maxHp);
	});

	it('is gone once it has crossed the hall', () => {
		const world = worldWithTrain();
		run(world, warningSeconds + 0.2);
		expect(world.train).not.toBeNull();

		run(world, FULL_PASS);
		expect(world.train).toBeNull();
	});

	it('leaves the crew start positions clear of both tracks', () => {
		for (const player of createWorld().players) {
			for (const trackX of trackXs) {
				const clear = Math.abs(player.position.x - trackX) - player.radius;
				expect(clear).toBeGreaterThan(laneHalfWidth);
			}
		}
	});
});
