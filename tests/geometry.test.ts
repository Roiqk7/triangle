import { describe, expect, it } from 'vitest';
import {
	circlesOverlap,
	clamp,
	distancePointToSegment,
	pushOutOfCircle,
	segmentCrossesCircle,
} from '../src/math/geometry';

describe('distancePointToSegment', () => {
	const a = { x: 0, y: 0 };
	const b = { x: 10, y: 0 };

	it('measures straight to the line when the point is beside the segment', () => {
		expect(distancePointToSegment({ x: 5, y: 3 }, a, b)).toBeCloseTo(3);
	});

	it('measures to the nearest end when the point is past the segment', () => {
		expect(distancePointToSegment({ x: 13, y: 4 }, a, b)).toBeCloseTo(5);
		expect(distancePointToSegment({ x: -3, y: -4 }, a, b)).toBeCloseTo(5);
	});

	it('is zero for a point on the segment', () => {
		expect(distancePointToSegment({ x: 7, y: 0 }, a, b)).toBeCloseTo(0);
	});

	it('handles a segment of zero length', () => {
		expect(distancePointToSegment({ x: 3, y: 4 }, a, a)).toBeCloseTo(5);
	});
});

describe('circlesOverlap', () => {
	it('is true when circles intersect or touch', () => {
		expect(circlesOverlap({ x: 0, y: 0 }, 5, { x: 8, y: 0 }, 5)).toBe(true);
		expect(circlesOverlap({ x: 0, y: 0 }, 5, { x: 10, y: 0 }, 5)).toBe(true);
	});

	it('is false when circles are apart', () => {
		expect(circlesOverlap({ x: 0, y: 0 }, 5, { x: 10.1, y: 0 }, 5)).toBe(false);
	});
});

describe('clamp', () => {
	it('keeps a value inside the range', () => {
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(11, 0, 10)).toBe(10);
		expect(clamp(4, 0, 10)).toBe(4);
	});
});

describe('segmentCrossesCircle', () => {
	const a = { x: 0, y: 0 };
	const b = { x: 100, y: 0 };

	it('is true when the segment passes through the circle', () => {
		expect(segmentCrossesCircle(a, b, { x: 50, y: 10 }, 20)).toBe(true);
	});

	it('is false when the circle is beside or beyond the segment', () => {
		expect(segmentCrossesCircle(a, b, { x: 50, y: 30 }, 20)).toBe(false);
		expect(segmentCrossesCircle(a, b, { x: 130, y: 0 }, 20)).toBe(false);
	});
});

describe('pushOutOfCircle', () => {
	const fixed = { x: 0, y: 0 };

	it('leaves a circle alone when it does not overlap', () => {
		const center = { x: 50, y: 0 };
		expect(pushOutOfCircle(center, 10, fixed, 30)).toBe(center);
	});

	it('moves an overlapping circle straight out until they just touch', () => {
		const moved = pushOutOfCircle({ x: 0, y: 20 }, 10, fixed, 30);
		expect(moved.x).toBeCloseTo(0);
		expect(moved.y).toBeCloseTo(40);
	});

	it('still moves a circle out when the centres coincide', () => {
		const moved = pushOutOfCircle(fixed, 10, fixed, 30);
		expect(Math.hypot(moved.x, moved.y)).toBeCloseTo(40);
	});
});
