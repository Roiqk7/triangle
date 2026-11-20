import { scale } from '../math/vec2';
import type { Enemy } from '../world/Enemy';
import type { World } from '../world/World';
import type { EnemyBehavior } from './EnemyBehavior';
import { nearestPlayer } from './nearestPlayer';
import { steerAround } from './steerAround';

/** Walks at the nearest player, going around pillars. Used by the Chaser and the Brute. */
export class SeekBehavior implements EnemyBehavior {
	update(enemy: Enemy, world: World): void {
		const target = nearestPlayer(enemy.position, world.players);
		const heading = steerAround(
			enemy.position,
			enemy.radius,
			target.position,
			world.obstacles,
		);
		enemy.velocity = scale(heading, enemy.speed);
	}
}
