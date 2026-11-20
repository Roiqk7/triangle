import type { EnemyKind } from '../src/config';
import { createEnemy } from '../src/enemies/createEnemy';
import type { Random } from '../src/math/random';

export { seededRandom } from '../src/math/random';
import { ZERO, type Vec2 } from '../src/math/vec2';
import type { Enemy } from '../src/world/Enemy';
import type { World } from '../src/world/World';

export const STEP = 1 / 60;
export const NO_MOVEMENT: Vec2[] = [ZERO, ZERO, ZERO];

/** A random source that never triggers a spawn. */
export const neverSpawn: Random = () => 0.999999;

export function addEnemy(world: World, kind: EnemyKind, position: Vec2): Enemy {
	const enemy = createEnemy(kind, position);
	world.enemies.push(enemy);
	return enemy;
}

/** Returns the given values in order, repeating the last one. */
export function sequence(...values: number[]): Random {
	let index = 0;
	return () => values[Math.min(index++, values.length - 1)];
}

export function midpoint(a: Vec2, b: Vec2): Vec2 {
	return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
