import type { Obstacle } from '../../world/Obstacle';
import { disc } from '../shapes';

/** Czech sorting colours: yellow for plastic, blue for paper, green for glass. */
const LID_COLORS = ['#facc15', '#2563eb', '#16a34a'];
const BODY_COLOR = '#71717a';
const HOLE_COLOR = '#18181b';
const HUB_COLOR = '#a1a1aa';

/** A three-way recycling bin seen from above: a steel drum with three coloured lids. */
export function drawRecyclingBin(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
	const { x, y } = obstacle.position;
	const r = obstacle.radius;
	const slice = (Math.PI * 2) / LID_COLORS.length;

	disc(ctx, x, y, r, BODY_COLOR);
	LID_COLORS.forEach((color, index) => {
		const start = index * slice - Math.PI / 2;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, r * 0.86, start, start + slice);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
		ctx.stroke();

		const middle = start + slice / 2;
		disc(
			ctx,
			x + Math.cos(middle) * r * 0.52,
			y + Math.sin(middle) * r * 0.52,
			r * 0.2,
			HOLE_COLOR,
		);
	});
	disc(ctx, x, y, r * 0.14, HUB_COLOR);
}
