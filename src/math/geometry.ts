import { add, distance, length, scale, sub, type Vec2 } from './vec2';

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/** Shortest distance from a point to the segment a–b. */
export function distancePointToSegment(point: Vec2, a: Vec2, b: Vec2): number {
	const ab = sub(b, a);
	const lengthSquared = ab.x * ab.x + ab.y * ab.y;
	if (lengthSquared === 0) return distance(point, a);

	const ap = sub(point, a);
	const t = clamp((ap.x * ab.x + ap.y * ab.y) / lengthSquared, 0, 1);
	return distance(point, add(a, scale(ab, t)));
}

export function circlesOverlap(
	centerA: Vec2,
	radiusA: number,
	centerB: Vec2,
	radiusB: number,
): boolean {
	return distance(centerA, centerB) <= radiusA + radiusB;
}

/** True when the segment a–b passes through the circle. */
export function segmentCrossesCircle(a: Vec2, b: Vec2, center: Vec2, radius: number): boolean {
	return distancePointToSegment(center, a, b) < radius;
}

/**
 * Where a moving circle should be so that it no longer overlaps a fixed one: pushed straight
 * out along the line between the centres. Returns the same centre if they do not overlap.
 */
export function pushOutOfCircle(
	center: Vec2,
	radius: number,
	fixedCenter: Vec2,
	fixedRadius: number,
): Vec2 {
	const minDistance = radius + fixedRadius;
	const offset = sub(center, fixedCenter);
	const current = length(offset);
	if (current >= minDistance) return center;

	const direction = current === 0 ? { x: 1, y: 0 } : scale(offset, 1 / current);
	return add(fixedCenter, scale(direction, minDistance));
}
