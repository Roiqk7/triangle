import type { Enemy } from '../world/Enemy';
import type { World } from '../world/World';

/** Decides where an enemy wants to go by setting its velocity. It does not move the enemy. */
export interface EnemyBehavior {
	update(enemy: Enemy, world: World, dt: number): void;
}
