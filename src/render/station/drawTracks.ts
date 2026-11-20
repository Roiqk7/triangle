import { config } from '../../config';

const HEIGHT = config.arena.height;
const { trackXs, laneHalfWidth } = config.train;

const BED_COLOR = 'rgba(70, 58, 46, 0.3)';
const SLEEPER_COLOR = 'rgba(74, 55, 40, 0.75)';
const RAIL_COLOR = '#6b7280';
const RAIL_SHINE_COLOR = '#d1d5db';
const EDGE_COLOR = '#eab308';
const SLEEPER_SPACING = 36;
const RAIL_OFFSET = 24;

/**
 * The two tracks set into the hall floor, top to bottom. A yellow line on each side marks
 * exactly how wide a train is, so players can see where it is safe to stand.
 */
export function drawTracks(ctx: CanvasRenderingContext2D): void {
	for (const trackX of trackXs) {
		ctx.fillStyle = BED_COLOR;
		ctx.fillRect(trackX - laneHalfWidth, 0, laneHalfWidth * 2, HEIGHT);

		ctx.fillStyle = SLEEPER_COLOR;
		for (let y = SLEEPER_SPACING / 2; y < HEIGHT; y += SLEEPER_SPACING) {
			ctx.fillRect(trackX - 36, y - 5, 72, 10);
		}
		for (const side of [-1, 1]) {
			line(ctx, trackX + side * RAIL_OFFSET, RAIL_COLOR, 7);
			line(ctx, trackX + side * RAIL_OFFSET, RAIL_SHINE_COLOR, 2);
			line(ctx, trackX + side * laneHalfWidth, EDGE_COLOR, 4);
		}
	}
}

function line(ctx: CanvasRenderingContext2D, x: number, color: string, width: number): void {
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(x, 0);
	ctx.lineTo(x, HEIGHT);
	ctx.stroke();
}
