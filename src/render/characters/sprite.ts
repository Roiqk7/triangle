import type { Vec2 } from '../../math/vec2';
import { palette } from '../palette';
import { disc, oval } from '../shapes';

/** Where and how a character stands. Anything with these fields can be drawn as a character. */
export interface Pose {
	readonly position: Vec2;
	/** Size of the character for the rules; the drawing is a little larger. */
	readonly radius: number;
	/** Angle in radians; 0 looks right. */
	readonly facing: number;
	/** Distance walked so far; moves the feet and hands. */
	readonly walked: number;
}

/** Characters are drawn larger than they collide, which makes near misses feel fair. */
const DRAWN_SIZE = 1.45;
/** Characters are designed on a grid where the shoulders are about this far from the centre. */
const DESIGN_RADIUS = 10;
const OUTLINE_WIDTH = 1.15;
const STRIDE_PER_UNIT = 0.16;
const FOOT_REACH = 4.5;
const HAND_REACH = 3.5;

/** How many arena units one design unit covers for this pose. */
export function drawnScale(pose: Pose): number {
	return (pose.radius * DRAWN_SIZE) / DESIGN_RADIUS;
}

/** Swings between -1 and 1 as the character walks. */
export function stride(pose: Pose): number {
	return Math.sin(pose.walked * STRIDE_PER_UNIT);
}

/**
 * Draws a shadow, then runs `draw` in the character's own space: origin at its centre,
 * looking right, shoulders about 10 units out. Shapes drawn there get the cartoon outline.
 */
export function withPose(ctx: CanvasRenderingContext2D, pose: Pose, draw: () => void): void {
	const size = drawnScale(pose);
	const { x, y } = pose.position;
	oval(ctx, x + size * 2, y + size * 3, size * 10, size * 9, palette.shadow, false);

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(pose.facing);
	ctx.scale(size, size);
	ctx.strokeStyle = palette.outline;
	ctx.lineWidth = OUTLINE_WIDTH;
	ctx.lineJoin = 'round';
	draw();
	ctx.restore();
}

/** Two shoes that take turns stepping forward. Draw them first, under the body. */
export function drawFeet(ctx: CanvasRenderingContext2D, swing: number, color: string): void {
	oval(ctx, swing * FOOT_REACH + 1, -4.4, 4, 2.6, color);
	oval(ctx, -swing * FOOT_REACH + 1, 4.4, 4, 2.6, color);
}

/** Two hands that swing opposite to the feet, `spread` units out from the centre. */
export function drawHands(
	ctx: CanvasRenderingContext2D,
	swing: number,
	color: string,
	spread: number,
): void {
	disc(ctx, -swing * HAND_REACH + 1.5, -spread, 2.5, color);
	disc(ctx, swing * HAND_REACH + 1.5, spread, 2.5, color);
}
