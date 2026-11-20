import type { Vec2 } from '../math/vec2';

export interface Player {
	/** 0, 1 or 2. Index into key bindings and colours. */
	readonly id: number;
	readonly radius: number;
	position: Vec2;
	/** Current speed and direction; eases towards what the keys ask for. */
	velocity: Vec2;
	/** Direction the player looks, as an angle in radians. */
	facing: number;
	/** Total distance walked so far; drives the walking animation. */
	walked: number;
}
