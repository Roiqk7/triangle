import type { Obstacle } from '../../world/Obstacle';
import { disc } from '../shapes';

const POT_COLOR = '#a8a29e';
const SOIL_COLOR = '#57412f';
const LEAF_COLORS = ['#15803d', '#22a04b'];
const HEART_COLOR = '#14532d';
const LEAVES = 10;
const SWAY = 0.05;

/** A concrete planter with a palm seen from above; the leaves sway a little. */
export function drawPlanter(
	ctx: CanvasRenderingContext2D,
	obstacle: Obstacle,
	clock: number,
): void {
	const { x, y } = obstacle.position;
	const r = obstacle.radius;

	disc(ctx, x, y, r, POT_COLOR);
	disc(ctx, x, y, r * 0.82, SOIL_COLOR);

	for (let i = 0; i < LEAVES; i++) {
		const angle = (i / LEAVES) * Math.PI * 2 + Math.sin(clock * 0.9 + i) * SWAY;
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);
		ctx.beginPath();
		ctx.ellipse(r * 0.5, 0, r * 0.48, r * 0.15, 0, 0, Math.PI * 2);
		ctx.fillStyle = LEAF_COLORS[i % LEAF_COLORS.length];
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	disc(ctx, x, y, r * 0.14, HEART_COLOR);
}
