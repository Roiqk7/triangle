import { config } from '../config';
import type { Random } from '../math/random';
import { distance } from '../math/vec2';
import type { Obstacle } from './Obstacle';

/**
 * Places pillars at random. Tries random spots and keeps the ones that fit, so a crowded
 * layout may end up with fewer pillars than asked for.
 */
export function generateObstacles(random: Random): Obstacle[] {
	const { count, maxAttempts } = config.obstacles;
	const obstacles: Obstacle[] = [];

	for (let attempt = 0; attempt < maxAttempts && obstacles.length < count; attempt++) {
		const candidate = randomObstacle(random);
		if (fits(candidate, obstacles)) obstacles.push(candidate);
	}
	return obstacles;
}

function randomObstacle(random: Random): Obstacle {
	const { minRadius, maxRadius, edgeMargin } = config.obstacles;
	const { width, height } = config.arena;
	const radius = minRadius + random() * (maxRadius - minRadius);
	const inset = edgeMargin + radius;

	return {
		radius,
		position: {
			x: inset + random() * (width - 2 * inset),
			y: inset + random() * (height - 2 * inset),
		},
	};
}

/** Clear of the start area, of the train tracks and of every pillar placed so far. */
function fits(candidate: Obstacle, placed: readonly Obstacle[]): boolean {
	return (
		isClearOfCenter(candidate) &&
		isClearOfTracks(candidate) &&
		placed.every((other) => gapBetween(candidate, other) >= config.obstacles.minGap)
	);
}

function isClearOfCenter({ position, radius }: Obstacle): boolean {
	const center = { x: config.arena.width / 2, y: config.arena.height / 2 };
	return distance(position, center) - radius >= config.obstacles.clearCenterRadius;
}

function isClearOfTracks({ position, radius }: Obstacle): boolean {
	const keepAway = config.train.laneHalfWidth + config.obstacles.trackMargin + radius;
	return config.train.trackXs.every((trackX) => Math.abs(position.x - trackX) >= keepAway);
}

function gapBetween(a: Obstacle, b: Obstacle): number {
	return distance(a.position, b.position) - a.radius - b.radius;
}
