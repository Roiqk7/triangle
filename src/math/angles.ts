import type { Vec2 } from './vec2';

/** Direction of a vector as an angle in radians; 0 points right. */
export function angleOf(v: Vec2): number {
	return Math.atan2(v.y, v.x);
}

/** Turns `current` towards `target` by at most `maxStep` radians, the short way round. */
export function turnTowards(current: number, target: number, maxStep: number): number {
	const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
	if (Math.abs(difference) <= maxStep) return target;
	return current + Math.sign(difference) * maxStep;
}
