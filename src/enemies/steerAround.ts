import { angleOf } from '../math/angles';
import { segmentCrossesCircle } from '../math/geometry';
import { directionTo, distance, length, sub, type Vec2 } from '../math/vec2';
import type { Obstacle } from '../world/Obstacle';

/** Extra room a walker aims to leave between itself and a pillar it passes. */
const CLEARANCE = 6;
/** A pillar counts as in the way if the straight path would pass closer than this. */
const NEAR_MISS = CLEARANCE / 2;

/**
 * The direction to walk in to get from `from` to `target` without walking into a pillar.
 * If a pillar is in the way, it heads along the line that just brushes past the pillar, on
 * the side the walker is already nearer to, so walkers flow around furniture instead of
 * bumping into it.
 */
export function steerAround(
	from: Vec2,
	radius: number,
	target: Vec2,
	obstacles: readonly Obstacle[],
): Vec2 {
	const straight = directionTo(from, target);
	const blocker = firstInTheWay(from, radius, target, obstacles);
	if (!blocker) return straight;

	const toBlocker = sub(blocker.position, from);
	const keepOut = blocker.radius + radius + CLEARANCE;
	/** Angle between the line to the pillar's centre and the line that just brushes past it. */
	const brushAngle = Math.asin(Math.min(1, keepOut / length(toBlocker)));
	const blockerIsOnLeft = straight.x * toBlocker.y - straight.y * toBlocker.x > 0;

	const heading = angleOf(toBlocker) + (blockerIsOnLeft ? -brushAngle : brushAngle);
	return { x: Math.cos(heading), y: Math.sin(heading) };
}

/** The nearest pillar that the straight path would run into. */
function firstInTheWay(
	from: Vec2,
	radius: number,
	target: Vec2,
	obstacles: readonly Obstacle[],
): Obstacle | undefined {
	const reach = radius + NEAR_MISS;
	return obstacles
		.filter((obstacle) =>
			segmentCrossesCircle(
				from,
				target,
				obstacle.position,
				obstacle.radius + reach,
			),
		)
		.sort((a, b) => distance(from, a.position) - distance(from, b.position))[0];
}
