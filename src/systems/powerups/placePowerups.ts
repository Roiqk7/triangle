import { config, type PowerupKind } from '../../config';
import { clamp } from '../../math/geometry';
import type { Random } from '../../math/random';
import { distance, type Vec2 } from '../../math/vec2';
import type { World } from '../../world/World';

/** How far from the walls power-ups are kept, so they are never half out of sight. */
const WALL_INSET = 110;
/** Room kept between a power-up and a pillar, so a player can always reach it. */
const PILLAR_ROOM = 40;
const PLACEMENT_TRIES = 30;

/** Puts one power-up somewhere reachable on the floor, if there is room for another. */
export function placePowerup(world: World, random: Random): void {
	if (!hasRoomForAnother(world)) return;
	addPowerup(world, freeSpot(world, random), random);
}

/** Called where an enemy was washed away: now and then it leaves a power-up behind. */
export function maybeDropPowerup(world: World, position: Vec2, random: Random): void {
	if (world.wave.number < config.powerups.firstWave || !hasRoomForAnother(world)) return;
	if (random() >= config.powerups.dropChance) return;
	addPowerup(world, insideWalls(position), random);
}

function hasRoomForAnother(world: World): boolean {
	return world.powerups.length < config.powerups.maxOnFloor;
}

function addPowerup(world: World, position: Vec2, random: Random): void {
	world.powerups.push({ kind: pickKind(world, random), position, spawnedAt: world.time });
}

/** Any kind, except that a shield is not offered while the crew already holds the maximum. */
function pickKind(world: World, random: Random): PowerupKind {
	const shieldsFull = world.shields >= config.powerups.maxShields;
	const offered = config.powerups.kinds.filter((kind) => kind !== 'shield' || !shieldsFull);
	return offered[Math.floor(random() * offered.length)];
}

/** A random spot away from the walls and clear of every pillar. */
function freeSpot(world: World, random: Random): Vec2 {
	const { width, height } = config.arena;
	for (let attempt = 0; attempt < PLACEMENT_TRIES; attempt++) {
		const spot = {
			x: WALL_INSET + random() * (width - 2 * WALL_INSET),
			y: WALL_INSET + random() * (height - 2 * WALL_INSET),
		};
		const clear = world.obstacles.every(
			(obstacle) =>
				distance(spot, obstacle.position) >= obstacle.radius + PILLAR_ROOM,
		);
		if (clear) return spot;
	}
	return { x: width / 2, y: height / 2 };
}

function insideWalls(position: Vec2): Vec2 {
	return {
		x: clamp(position.x, WALL_INSET, config.arena.width - WALL_INSET),
		y: clamp(position.y, WALL_INSET, config.arena.height - WALL_INSET),
	};
}
