export interface Vec2 {
	readonly x: number;
	readonly y: number;
}

export const ZERO: Vec2 = { x: 0, y: 0 };

export function add(a: Vec2, b: Vec2): Vec2 {
	return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
	return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(v: Vec2, factor: number): Vec2 {
	return { x: v.x * factor, y: v.y * factor };
}

export function length(v: Vec2): number {
	return Math.hypot(v.x, v.y);
}

export function distance(a: Vec2, b: Vec2): number {
	return length(sub(a, b));
}

/** Unit vector in the same direction, or zero for a zero vector. */
export function normalize(v: Vec2): Vec2 {
	const len = length(v);
	return len === 0 ? ZERO : scale(v, 1 / len);
}

/** Unit vector pointing from one point to another. */
export function directionTo(from: Vec2, to: Vec2): Vec2 {
	return normalize(sub(to, from));
}

/** Moves `current` towards `target` by at most `maxChange`, without overshooting. */
export function approach(current: Vec2, target: Vec2, maxChange: number): Vec2 {
	const difference = sub(target, current);
	if (length(difference) <= maxChange) return target;
	return add(current, scale(normalize(difference), maxChange));
}
