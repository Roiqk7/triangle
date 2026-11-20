import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { steerAround } from '../src/enemies/steerAround';
import { turnTowards } from '../src/math/angles';
import { distance, length, ZERO } from '../src/math/vec2';
import { movePlayers } from '../src/systems/movePlayers';
import { step } from '../src/systems/step';
import type { Obstacle } from '../src/world/Obstacle';
import { createWorld } from '../src/world/World';
import { addEnemy, neverSpawn, NO_MOVEMENT, STEP } from './helpers';

const RIGHT = [{ x: 1, y: 0 }, ZERO, ZERO];

describe('player easing', () => {
	it('builds up speed over several steps instead of jumping to full speed', () => {
		const world = createWorld();
		const player = world.players[0];

		movePlayers(world, RIGHT, STEP);
		const afterOneStep = length(player.velocity);
		expect(afterOneStep).toBeGreaterThan(0);
		expect(afterOneStep).toBeLessThan(config.player.speed);

		for (let time = 0; time < 0.5; time += STEP) movePlayers(world, RIGHT, STEP);
		expect(length(player.velocity)).toBeCloseTo(config.player.speed);
	});

	it('glides to a stop when the keys are released', () => {
		const world = createWorld();
		const player = world.players[0];
		for (let time = 0; time < 0.5; time += STEP) movePlayers(world, RIGHT, STEP);
		const whereReleased = player.position.x;

		movePlayers(world, NO_MOVEMENT, STEP);
		expect(length(player.velocity)).toBeGreaterThan(0);

		for (let time = 0; time < 0.5; time += STEP) movePlayers(world, NO_MOVEMENT, STEP);
		expect(length(player.velocity)).toBe(0);
		expect(player.position.x - whereReleased).toBeLessThan(config.player.radius * 2);
	});
});

describe('turnTowards', () => {
	it('never turns more than the allowed step', () => {
		expect(turnTowards(0, 1, 0.25)).toBeCloseTo(0.25);
		expect(turnTowards(0, -1, 0.25)).toBeCloseTo(-0.25);
	});

	it('lands exactly on the target when it is within reach', () => {
		expect(turnTowards(0, 0.1, 0.25)).toBeCloseTo(0.1);
	});

	it('takes the short way round across the back', () => {
		const almostBackLeft = Math.PI - 0.1;
		const almostBackRight = -Math.PI + 0.1;
		expect(turnTowards(almostBackLeft, almostBackRight, 0.05)).toBeGreaterThan(
			almostBackLeft,
		);
	});
});

describe('steerAround', () => {
	const from = { x: 0, y: 0 };
	const target = { x: 400, y: 0 };

	it('heads straight for the target when nothing is in the way', () => {
		expect(steerAround(from, 12, target, [])).toEqual({ x: 1, y: 0 });
	});

	it('ignores a pillar that is beside the path', () => {
		const pillar: Obstacle = { position: { x: 200, y: 200 }, radius: 40 };
		expect(steerAround(from, 12, target, [pillar])).toEqual({ x: 1, y: 0 });
	});

	it('aims past the side of a pillar in the way that it is already nearer to', () => {
		const below: Obstacle = { position: { x: 200, y: 20 }, radius: 40 };
		const above: Obstacle = { position: { x: 200, y: -20 }, radius: 40 };

		expect(steerAround(from, 12, target, [below]).y).toBeLessThan(0);
		expect(steerAround(from, 12, target, [above]).y).toBeGreaterThan(0);
	});

	it('gets an enemy past a pillar that is dead centre in its way without touching it', () => {
		const top = createWorld().players[1].position;
		const pillar: Obstacle = { position: { x: top.x, y: top.y - 130 }, radius: 40 };
		const world = createWorld([pillar]);
		const chaser = addEnemy(world, 'chaser', { x: top.x, y: top.y - 240 });

		let closest = Infinity;
		while (!world.over && world.time < 3.5) {
			step(world, NO_MOVEMENT, STEP, neverSpawn);
			closest = Math.min(closest, distance(chaser.position, pillar.position));
		}

		expect(world.over).toBe(true);
		expect(closest).toBeGreaterThan(pillar.radius + chaser.radius);
	});
});
