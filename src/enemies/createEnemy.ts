import { config, type BehaviorKind, type EnemyKind } from '../config';
import { ZERO, type Vec2 } from '../math/vec2';
import type { Enemy } from '../world/Enemy';
import { DashBehavior } from './DashBehavior';
import type { EnemyBehavior } from './EnemyBehavior';
import { SeekBehavior } from './SeekBehavior';

/** The only place that knows which class implements which behaviour. */
const behaviorFactories: Record<BehaviorKind, () => EnemyBehavior> = {
	seek: () => new SeekBehavior(),
	dash: () => new DashBehavior(config.dash),
};

export function createEnemy(kind: EnemyKind, position: Vec2): Enemy {
	const stats = config.enemies[kind];
	return {
		kind,
		radius: stats.radius,
		maxHp: stats.hp,
		hp: stats.hp,
		speed: stats.speed,
		behavior: behaviorFactories[stats.behavior](),
		position,
		velocity: ZERO,
		facing: 0,
		walked: 0,
		aim: null,
	};
}
