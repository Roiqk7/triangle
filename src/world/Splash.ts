import type { Vec2 } from '../math/vec2';

/** A short burst left where an enemy was removed. Only for show; it affects nothing. */
export interface Splash {
	readonly position: Vec2;
	/** Radius of the enemy that was removed. */
	readonly radius: number;
	/** World time, in seconds, at which it appeared. */
	readonly startedAt: number;
}
