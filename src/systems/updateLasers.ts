import { distancePointToSegment } from '../math/geometry';
import type { Enemy } from '../world/Enemy';
import type { Laser } from '../world/Laser';
import type { World } from '../world/World';
import { buildLasers } from './buildLasers';
import { laserDamagePerSecond, laserHalfWidth, laserMaxLength } from './modifiers';

/** Rebuilds the lasers from the players' positions and damages the enemies they touch. */
export function updateLasers(world: World, dt: number): void {
	world.lasers = buildLasers(
		world.players,
		world.obstacles,
		laserMaxLength(world),
		world.lasers,
		dt,
	);

	const damage = laserDamagePerSecond(world) * dt;
	const halfWidth = laserHalfWidth(world);
	for (const laser of world.lasers) {
		if (!laser.active) continue;
		for (const enemy of world.enemies) {
			if (touches(laser, enemy, halfWidth)) enemy.hp -= damage;
		}
	}
}

function touches(laser: Laser, enemy: Enemy, halfWidth: number): boolean {
	const reach = enemy.radius + halfWidth;
	return distancePointToSegment(enemy.position, laser.from, laser.to) <= reach;
}
