import type { Vec2 } from '../math/vec2';

export interface Laser {
	readonly from: Vec2;
	readonly to: Vec2;
	/** True when a pillar stands between the two players. */
	readonly blocked: boolean;
	/** Length divided by the max length: above 1 the laser is overstretched. */
	readonly strain: number;
	/** Seconds of overstretch built up; it snaps when this reaches the snap time. */
	readonly overstretch: number;
	/** True once it has snapped. It stays snapped until the players are back within range. */
	readonly snapped: boolean;
	/** False when blocked or snapped. Only active lasers do damage. */
	readonly active: boolean;
}
