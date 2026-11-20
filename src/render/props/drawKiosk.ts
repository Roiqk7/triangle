import type { Obstacle } from '../../world/Obstacle';
import { disc } from '../shapes';

const STRIPE_COLORS = ['#dc2626', '#fef2f2'];
const CAP_COLOR = '#7f1d1d';
const SEAM_COLOR = 'rgba(35, 31, 32, 0.25)';
const STRIPES = 12;

/** A coffee kiosk seen from above: all you see is its big red-and-white striped awning. */
export function drawKiosk(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
	const { x, y } = obstacle.position;
	const r = obstacle.radius;
	const slice = (Math.PI * 2) / STRIPES;

	for (let i = 0; i < STRIPES; i++) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, r, i * slice, (i + 1) * slice);
		ctx.closePath();
		ctx.fillStyle = STRIPE_COLORS[i % STRIPE_COLORS.length];
		ctx.fill();
	}
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.stroke();

	ctx.save();
	ctx.strokeStyle = SEAM_COLOR;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
	ctx.stroke();
	ctx.restore();

	disc(ctx, x, y, r * 0.13, CAP_COLOR);
}
