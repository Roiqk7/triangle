import type { Vec2 } from '../math/vec2';

/** A round pillar. Nothing walks through it and no laser passes it. */
export interface Obstacle {
	readonly position: Vec2;
	readonly radius: number;
}
