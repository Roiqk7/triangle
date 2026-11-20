import { config } from '../config';
import { angleOf, turnTowards } from '../math/angles';
import { add, length, scale, type Vec2 } from '../math/vec2';
import type { Enemy } from '../world/Enemy';
import type { World } from '../world/World';
import { keepOutOfObstacles } from './keepOutOfObstacles';
import { enemySpeedFactor } from './modifiers';

/** Lets each enemy choose its velocity, then moves it, sliding around pillars. */
export function updateEnemies(world: World, dt: number): void {
	const slowdown = enemySpeedFactor(world);

	for (const enemy of world.enemies) {
		enemy.behavior.update(enemy, world, dt);
		const moved = scale(enemy.velocity, slowdown * dt);
		const wanted = add(enemy.position, moved);
		enemy.position = keepOutOfObstacles(wanted, enemy.radius, world.obstacles);
		turnAndStride(enemy, length(moved), dt);
	}
}

/** Bookkeeping for drawing: where the enemy looks and how far it has walked. */
function turnAndStride(enemy: Enemy, distance: number, dt: number): void {
	enemy.walked += distance;

	const heading: Vec2 | null = length(enemy.velocity) > 0 ? enemy.velocity : enemy.aim;
	if (!heading) return;
	enemy.facing = turnTowards(enemy.facing, angleOf(heading), config.enemyTurnSpeed * dt);
}
