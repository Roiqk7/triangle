import { palette } from '../palette';
import { box, disc, line, oval } from '../shapes';
import { drawFeet, drawHands, stride, withPose, type Pose } from './sprite';

const BOOT_COLOR = '#111827';
const UNIFORM_COLOR = '#1e3a8a';
const EPAULETTE_COLOR = '#93c5fd';
const GLOVE_COLOR = '#111827';
const CAP_BAND_COLOR = '#f8fafc';
const BADGE_COLOR = '#e2e8f0';
const BRIM_COLOR = '#0f172a';
const SHIELD_FILL = 'rgba(186, 230, 253, 0.35)';
const SHIELD_EDGE = 'rgba(224, 242, 254, 0.95)';
const SHIELD_REACH = 13;
const SHIELD_HALF_ANGLE = 0.95;

/**
 * A riot cop seen from above: navy uniform, peaked cap with a white band and badge, a baton,
 * and a clear shield held out in front, which is why he takes so long to wash away.
 */
export function drawCop(ctx: CanvasRenderingContext2D, pose: Pose): void {
	withPose(ctx, pose, () => {
		const swing = stride(pose);
		drawFeet(ctx, swing, BOOT_COLOR);
		line(ctx, 1, 10.6, 9.5, 13, BOOT_COLOR, 2);

		oval(ctx, 0, 0, 7.4, 10.6, UNIFORM_COLOR);
		box(ctx, -2, -9.6, 4, 2.4, 0.8, EPAULETTE_COLOR);
		box(ctx, -2, 7.2, 4, 2.4, 0.8, EPAULETTE_COLOR);
		drawHands(ctx, swing * 0.5, GLOVE_COLOR, 10.2);
		drawShield(ctx);

		disc(ctx, 1.9, 0, 4.6, palette.skin);
		oval(ctx, 5.2, 0, 3.1, 4.2, BRIM_COLOR);
		disc(ctx, 1.2, 0, 5, UNIFORM_COLOR);
		ctx.save();
		ctx.strokeStyle = CAP_BAND_COLOR;
		ctx.beginPath();
		ctx.arc(1.2, 0, 3.4, 0, Math.PI * 2);
		ctx.stroke();
		ctx.restore();
		disc(ctx, 4.3, 0, 1.1, BADGE_COLOR);
	});
}

/** A curved clear shield in front of the body. */
function drawShield(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.arc(0, 0, SHIELD_REACH, -SHIELD_HALF_ANGLE, SHIELD_HALF_ANGLE);
	ctx.arc(0, 0, SHIELD_REACH - 2.4, SHIELD_HALF_ANGLE, -SHIELD_HALF_ANGLE, true);
	ctx.closePath();
	ctx.fillStyle = SHIELD_FILL;
	ctx.fill();
	ctx.strokeStyle = SHIELD_EDGE;
	ctx.lineWidth = 0.8;
	ctx.stroke();
	ctx.restore();
}
