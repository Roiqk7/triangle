import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { ZERO } from '../src/math/vec2';
import { movePlayers } from '../src/systems/movePlayers';
import { step } from '../src/systems/step';
import { updateEnemies } from '../src/systems/updateEnemies';
import { removeWashedEnemies } from '../src/systems/removeWashedEnemies';
import { updateLasers } from '../src/systems/updateLasers';
import { createWorld } from '../src/world/World';
import { addEnemy, midpoint, neverSpawn, NO_MOVEMENT, STEP } from './helpers';

/** What the drawing code relies on: which way characters face, how far they walked, splashes. */
describe('facing and walking', () => {
	it('turns a player to face the way it moves and counts the distance', () => {
		const world = createWorld();
		const player = world.players[0];

		movePlayers(world, [{ x: 0, y: 1 }, ZERO, ZERO], 0.5);

		expect(player.facing).toBeCloseTo(Math.PI / 2);
		expect(player.walked).toBeCloseTo(config.player.speed * 0.5);
	});

	it('keeps a standing player facing the way it last moved', () => {
		const world = createWorld();
		const player = world.players[0];
		movePlayers(world, [{ x: -1, y: 0 }, ZERO, ZERO], STEP);
		const facing = player.facing;
		const walked = player.walked;

		movePlayers(world, NO_MOVEMENT, STEP);

		expect(player.facing).toBe(facing);
		expect(player.walked).toBe(walked);
	});

	it('turns an enemy towards its target and counts the distance', () => {
		const world = createWorld();
		const top = world.players[1].position;
		const chaser = addEnemy(world, 'chaser', { x: top.x, y: top.y - 200 });

		updateEnemies(world, 1);

		expect(chaser.facing).toBeCloseTo(Math.PI / 2);
		expect(chaser.walked).toBeCloseTo(config.enemies.chaser.speed);
	});

	it('turns a Dasher towards its announced sprint while it stands still', () => {
		const world = createWorld();
		const top = world.players[1].position;
		const dasher = addEnemy(world, 'dasher', { x: top.x - 200, y: top.y });

		updateEnemies(world, STEP);

		expect(dasher.aim).not.toBeNull();
		expect(dasher.facing).toBeCloseTo(0);
		expect(dasher.walked).toBe(0);
	});
});

describe('splashes', () => {
	function worldWithOneKill() {
		const world = createWorld();
		const [p1, , p3] = world.players;
		const spot = midpoint(p1.position, p3.position);
		addEnemy(world, 'chaser', spot);
		updateLasers(world, STEP);
		removeWashedEnemies(world, neverSpawn);
		return { world, spot };
	}

	it('leaves a splash where an enemy was washed away', () => {
		const { world, spot } = worldWithOneKill();

		expect(world.splashes).toHaveLength(1);
		expect(world.splashes[0].position).toEqual(spot);
		expect(world.splashes[0].radius).toBe(config.enemies.chaser.radius);
	});

	it('forgets a splash once it has finished playing', () => {
		const { world } = worldWithOneKill();

		for (let time = 0; time < config.splash.seconds / 2; time += STEP) {
			step(world, NO_MOVEMENT, STEP, neverSpawn);
		}
		expect(world.splashes).toHaveLength(1);

		for (let time = 0; time < config.splash.seconds; time += STEP) {
			step(world, NO_MOVEMENT, STEP, neverSpawn);
		}
		expect(world.splashes).toHaveLength(0);
	});
});
