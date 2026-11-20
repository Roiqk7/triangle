import { palette } from '../palette';
import { box, disc, line, oval } from '../shapes';
import { drawText } from '../text';
import { drawFeet, drawHands, drawnScale, stride, withPose, type Pose } from './sprite';

const BOOT_COLOR = '#3f3f46';
const VEST_COLOR = '#f97316';
const STRIPE_COLOR = '#f1f5f9';
const GLOVE_COLOR = '#fde047';
const BRIM_COLOR = '#334155';
const MOP_HANDLE_COLOR = '#a16207';
const MOP_HEAD_COLOR = '#e7e5e4';
const HEAD_FORWARD = 1.5;

/**
 * A janitor seen from above: orange hi-vis vest, rubber gloves, a mop, a sanitizer tank on
 * the back, and a cap in the player's colour with the player's number on it.
 */
export function drawJanitor(
	ctx: CanvasRenderingContext2D,
	pose: Pose,
	color: string,
	label: string,
): void {
	withPose(ctx, pose, () => {
		const swing = stride(pose);
		drawFeet(ctx, swing, BOOT_COLOR);

		box(ctx, -12, -4.6, 6.5, 9.2, 2.2, color);
		disc(ctx, -9, 0, 1.5, STRIPE_COLOR);

		oval(ctx, 0, 0, 6.4, 10, VEST_COLOR);
		line(ctx, -4.6, -5.6, 4.6, -5.6, STRIPE_COLOR, 1.7);
		line(ctx, -4.6, 5.6, 4.6, 5.6, STRIPE_COLOR, 1.7);
		drawMop(ctx, swing);
		drawHands(ctx, swing, GLOVE_COLOR, 9.6);

		oval(ctx, HEAD_FORWARD + 4, 0, 3.4, 4.3, BRIM_COLOR);
		disc(ctx, HEAD_FORWARD, 0, 5.2, color);
	});
	drawCapNumber(ctx, pose, label);
}

/** Carried in the right hand, head forward, bobbing with each step. */
function drawMop(ctx: CanvasRenderingContext2D, swing: number): void {
	const reach = swing * 1.5;
	line(ctx, -3 + reach, 9.2, 11 + reach, 11.6, MOP_HANDLE_COLOR, 1.5);
	box(ctx, 10 + reach, 8.6, 4.2, 6.4, 1.6, MOP_HEAD_COLOR);
}

/** The number sits on the cap but always reads upright, whichever way the janitor faces. */
function drawCapNumber(ctx: CanvasRenderingContext2D, pose: Pose, label: string): void {
	const size = drawnScale(pose);
	const x = pose.position.x + Math.cos(pose.facing) * HEAD_FORWARD * size;
	const y = pose.position.y + Math.sin(pose.facing) * HEAD_FORWARD * size;

	drawText(ctx, label, x, y + size * 0.4, {
		size: size * 7,
		color: palette.outline,
		align: 'center',
		bold: true,
	});
}
