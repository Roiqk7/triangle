import type { PowerupKind } from '../config';
import type { Vec2 } from '../math/vec2';

/** Something lying on the floor that helps the crew when a player walks over it. */
export interface Powerup {
	readonly kind: PowerupKind;
	readonly position: Vec2;
	/** World time, in seconds, at which it appeared. */
	readonly spawnedAt: number;
}
