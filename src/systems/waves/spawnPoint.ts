import { config } from '../../config';
import type { Random } from '../../math/random';
import type { Vec2 } from '../../math/vec2';
import type { Entrance } from '../../world/Wave';

/** A random point just outside the given wall of the arena. */
export function spawnPoint(entrance: Entrance, random: Random): Vec2 {
	const { width, height } = config.arena;
	const { margin } = config.spawn;
	const along = random();

	const points: Record<Entrance, Vec2> = {
		top: { x: along * width, y: -margin },
		bottom: { x: along * width, y: height + margin },
		left: { x: -margin, y: along * height },
		right: { x: width + margin, y: along * height },
	};
	return points[entrance];
}
