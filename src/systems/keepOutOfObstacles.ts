import { pushOutOfCircle } from '../math/geometry';
import type { Vec2 } from '../math/vec2';
import type { Obstacle } from '../world/Obstacle';

/**
 * Returns where a circle may stand after trying to move to `position`: pushed out of any
 * pillar it ran into. Pushing straight out makes things slide around a pillar instead of
 * stopping dead.
 */
export function keepOutOfObstacles(
	position: Vec2,
	radius: number,
	obstacles: readonly Obstacle[],
): Vec2 {
	return obstacles.reduce(
		(current, obstacle) =>
			pushOutOfCircle(current, radius, obstacle.position, obstacle.radius),
		position,
	);
}
