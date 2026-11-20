import type { EnemyKind } from '../config';
import type { EnemyBehavior } from '../enemies/EnemyBehavior';
import type { Vec2 } from '../math/vec2';

export interface Enemy {
	readonly kind: EnemyKind;
	readonly radius: number;
	readonly maxHp: number;
	readonly speed: number;
	readonly behavior: EnemyBehavior;
	position: Vec2;
	velocity: Vec2;
	hp: number;
	/** Direction it is heading or aiming, as an angle in radians. */
	facing: number;
	/** Total distance walked so far; drives the walking animation. */
	walked: number;
	/** Direction of an announced dash, shown as a warning line. Null when not winding up. */
	aim: Vec2 | null;
}
