import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { length } from '../src/math/vec2';
import { createWorld } from '../src/world/World';
import { addEnemy, STEP } from './helpers';

describe('SeekBehavior', () => {
	it('heads for the nearest player at the enemy speed', () => {
		const world = createWorld();
		const top = world.players[1].position;
		const chaser = addEnemy(world, 'chaser', { x: top.x, y: top.y - 200 });

		chaser.behavior.update(chaser, world, STEP);

		expect(chaser.velocity.x).toBeCloseTo(0);
		expect(chaser.velocity.y).toBeCloseTo(config.enemies.chaser.speed);
	});
});

describe('DashBehavior', () => {
	const { triggerDistance, windUpSeconds, dashSeconds, dashSpeed } = config.dash;

	it('walks toward its target while far away', () => {
		const world = createWorld();
		const top = world.players[1].position;
		const dasher = addEnemy(world, 'dasher', {
			x: top.x,
			y: top.y - triggerDistance - 50,
		});

		dasher.behavior.update(dasher, world, STEP);

		expect(dasher.velocity.y).toBeCloseTo(config.enemies.dasher.speed);
		expect(dasher.aim).toBeNull();
	});

	it('stops and announces its direction when close enough', () => {
		const world = createWorld();
		const top = world.players[1].position;
		const dasher = addEnemy(world, 'dasher', {
			x: top.x,
			y: top.y - triggerDistance + 50,
		});

		dasher.behavior.update(dasher, world, STEP);

		expect(length(dasher.velocity)).toBe(0);
		expect(dasher.aim?.x).toBeCloseTo(0);
		expect(dasher.aim?.y).toBeCloseTo(1);
	});

	it('dashes in the announced direction even if the target has moved', () => {
		const world = createWorld();
		const top = world.players[1];
		const dasher = addEnemy(world, 'dasher', {
			x: top.position.x,
			y: top.position.y - triggerDistance + 50,
		});

		dasher.behavior.update(dasher, world, STEP); // starts the wind-up
		top.position = { x: top.position.x + 400, y: top.position.y };
		dasher.behavior.update(dasher, world, windUpSeconds + STEP); // wind-up ends
		dasher.behavior.update(dasher, world, STEP); // dashing

		expect(dasher.aim).toBeNull();
		expect(dasher.velocity.x).toBeCloseTo(0);
		expect(dasher.velocity.y).toBeCloseTo(dashSpeed);
	});

	it('goes back to walking after the dash', () => {
		const world = createWorld();
		const top = world.players[1].position;
		const dasher = addEnemy(world, 'dasher', {
			x: top.x,
			y: top.y - triggerDistance + 50,
		});

		dasher.behavior.update(dasher, world, STEP);
		dasher.behavior.update(dasher, world, windUpSeconds + STEP);
		dasher.behavior.update(dasher, world, dashSeconds + STEP); // dash ends
		dasher.behavior.update(dasher, world, STEP);

		expect(length(dasher.velocity)).toBeLessThan(dashSpeed);
	});
});
