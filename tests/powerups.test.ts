import { describe, expect, it } from 'vitest';
import { config, type PowerupKind } from '../src/config';
import { distance } from '../src/math/vec2';
import { checkContacts } from '../src/systems/checkContacts';
import {
	enemySpeedFactor,
	laserDamagePerSecond,
	laserHalfWidth,
	laserMaxLength,
	playerSpeed,
} from '../src/systems/modifiers';
import { collectPowerups } from '../src/systems/powerups/collectPowerups';
import { maybeDropPowerup, placePowerup } from '../src/systems/powerups/placePowerups';
import { removeWashedEnemies } from '../src/systems/removeWashedEnemies';
import { forgetOldThings, tickEffects } from '../src/systems/tidyUp';
import { updateEnemies } from '../src/systems/updateEnemies';
import { generateObstacles } from '../src/world/generateObstacles';
import { createWorld, type World } from '../src/world/World';
import { addEnemy, neverSpawn, seededRandom } from './helpers';

const settings = config.powerups;
const always = () => 0;

/** Puts a power-up under player 1 and lets the crew pick it up. */
function pickUp(world: World, kind: PowerupKind): void {
	world.powerups.push({ kind, position: world.players[0].position, spawnedAt: world.time });
	collectPowerups(world);
}

describe('picking up', () => {
	it('takes a power-up a player stands on and leaves the others', () => {
		const world = createWorld();
		world.powerups.push({ kind: 'coffee', position: { x: 60, y: 60 }, spawnedAt: 0 });
		pickUp(world, 'longHose');

		expect(world.powerups.map((powerup) => powerup.kind)).toEqual(['coffee']);
		expect(world.effects.longHose).toBe(settings.effectSeconds.longHose);
	});

	it('runs an effect for its time, then stops', () => {
		const world = createWorld();
		pickUp(world, 'coffee');

		tickEffects(world, settings.effectSeconds.coffee - 1);
		expect(playerSpeed(world)).toBeGreaterThan(config.player.speed);

		tickEffects(world, 2);
		expect(world.effects.coffee).toBe(0);
		expect(playerSpeed(world)).toBe(config.player.speed);
	});
});

describe('what each power-up does', () => {
	it('coffee makes the crew faster', () => {
		const world = createWorld();
		pickUp(world, 'coffee');
		expect(playerSpeed(world)).toBeCloseTo(
			config.player.speed * settings.coffeeSpeedFactor,
		);
	});

	it('long hose lets lasers reach further', () => {
		const world = createWorld();
		pickUp(world, 'longHose');
		expect(laserMaxLength(world)).toBeCloseTo(
			config.laser.maxLength * settings.longHoseLengthFactor,
		);
	});

	it('pressure washer makes lasers wider and stronger', () => {
		const world = createWorld();
		pickUp(world, 'pressure');
		expect(laserHalfWidth(world)).toBeGreaterThan(config.laser.halfWidth);
		expect(laserDamagePerSecond(world)).toBeGreaterThan(config.laser.damagePerSecond);
	});

	it('wet floor slows enemies down', () => {
		const world = createWorld();
		const chaser = addEnemy(world, 'chaser', { x: 100, y: 100 });
		pickUp(world, 'wetFloor');

		updateEnemies(world, 1);

		expect(enemySpeedFactor(world)).toBe(settings.wetFloorSpeedFactor);
		expect(chaser.walked).toBeCloseTo(
			config.enemies.chaser.speed * settings.wetFloorSpeedFactor,
		);
	});

	it('shield absorbs one touch and washes the toucher away', () => {
		const world = createWorld();
		pickUp(world, 'shield');
		addEnemy(world, 'chaser', world.players[1].position);

		checkContacts(world);
		removeWashedEnemies(world, neverSpawn);
		expect(world.over).toBe(false);
		expect(world.shields).toBe(0);
		expect(world.enemies).toHaveLength(0);

		addEnemy(world, 'chaser', world.players[1].position);
		checkContacts(world);
		expect(world.over).toBe(true);
		expect(world.caught).toBe(1);
	});

	it('never holds more shields than the maximum', () => {
		const world = createWorld();
		for (let i = 0; i < settings.maxShields + 2; i++) pickUp(world, 'shield');
		expect(world.shields).toBe(settings.maxShields);
	});

	it('foam bomb washes away everyone near the janitor who took it, and nobody further off', () => {
		const world = createWorld();
		const picker = world.players[0].position;
		addEnemy(world, 'chaser', {
			x: picker.x - settings.foamBombRadius + 20,
			y: picker.y,
		});
		const far = addEnemy(world, 'chaser', {
			x: picker.x - settings.foamBombRadius - 60,
			y: picker.y,
		});

		pickUp(world, 'foamBomb');
		removeWashedEnemies(world, neverSpawn);

		expect(world.enemies).toEqual([far]);
		expect(world.kills).toBe(1);
	});
});

describe('where power-ups come from', () => {
	it('drops one where an enemy was washed away, when the dice say so', () => {
		const world = createWorld();
		world.wave.number = settings.firstWave;

		maybeDropPowerup(world, { x: 400, y: 400 }, always);
		maybeDropPowerup(world, { x: 500, y: 400 }, neverSpawn);

		expect(world.powerups).toHaveLength(1);
		expect(world.powerups[0].position).toEqual({ x: 400, y: 400 });
	});

	it('drops nothing before power-ups have been introduced', () => {
		const world = createWorld();
		maybeDropPowerup(world, { x: 400, y: 400 }, always);
		expect(world.powerups).toHaveLength(0);
	});

	it('keeps a drop from outside the hall within reach', () => {
		const world = createWorld();
		world.wave.number = settings.firstWave;
		maybeDropPowerup(world, { x: -30, y: 2000 }, always);

		const { x, y } = world.powerups[0].position;
		expect(x).toBeGreaterThan(0);
		expect(y).toBeLessThan(config.arena.height);
	});

	it('never has more on the floor than the maximum', () => {
		const world = createWorld();
		for (let i = 0; i < settings.maxOnFloor + 3; i++)
			placePowerup(world, seededRandom(i));
		expect(world.powerups).toHaveLength(settings.maxOnFloor);
	});

	it('does not offer a shield while the crew holds the maximum', () => {
		const world = createWorld();
		world.shields = settings.maxShields;
		const random = seededRandom(5);

		for (let i = 0; i < 60; i++) {
			world.powerups = [];
			placePowerup(world, random);
			expect(world.powerups[0].kind).not.toBe('shield');
		}
	});

	it.each([1, 2, 3, 4, 5])('places them clear of every pillar (seed %i)', (seed) => {
		const random = seededRandom(seed);
		const world = createWorld(generateObstacles(random));
		placePowerup(world, random);

		const spot = world.powerups[0].position;
		for (const pillar of world.obstacles) {
			expect(distance(spot, pillar.position)).toBeGreaterThan(
				pillar.radius + settings.radius,
			);
		}
	});

	it('removes a power-up nobody came for', () => {
		const world = createWorld();
		world.powerups.push({ kind: 'coffee', position: { x: 60, y: 60 }, spawnedAt: 0 });

		world.time = settings.lifeSeconds - 1;
		forgetOldThings(world);
		expect(world.powerups).toHaveLength(1);

		world.time = settings.lifeSeconds + 1;
		forgetOldThings(world);
		expect(world.powerups).toHaveLength(0);
	});
});
