import { config } from '../../config';
import { disc, polygon } from '../shapes';

const CENTER_X = config.arena.width / 2;
const CENTER_Y = config.arena.height / 2;

/** Outer radius of the mosaic. Other floor markings stop here. */
export const MOSAIC_RADIUS = 190;

const STONE_COLOR = '#c7bca8';
const CREAM_COLOR = '#efe6d3';
const RED_COLOR = '#7f1d1d';
const GOLD_COLOR = '#c9a227';
const LINE_COLOR = '#5b4a3a';

/**
 * The round compass mosaic under the dome, in the middle of the hall. The crew starts each
 * shift standing on it.
 */
export function drawMosaic(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.translate(CENTER_X, CENTER_Y);
	ctx.strokeStyle = LINE_COLOR;
	ctx.lineWidth = 2;

	disc(ctx, 0, 0, MOSAIC_RADIUS, RED_COLOR);
	disc(ctx, 0, 0, MOSAIC_RADIUS - 12, CREAM_COLOR);
	disc(ctx, 0, 0, MOSAIC_RADIUS - 28, STONE_COLOR);

	polygon(ctx, star(8, 150, 58, Math.PI / 8), GOLD_COLOR);
	polygon(ctx, star(8, 132, 48, 0), RED_COLOR);
	disc(ctx, 0, 0, 30, CREAM_COLOR);
	disc(ctx, 0, 0, 14, GOLD_COLOR);
	ctx.restore();
}

/** Points of a star around the origin: tips at `outer`, notches at `inner`. */
function star(tips: number, outer: number, inner: number, turn: number): number[] {
	const points: number[] = [];
	for (let i = 0; i < tips * 2; i++) {
		const radius = i % 2 === 0 ? outer : inner;
		const angle = turn + (i * Math.PI) / tips;
		points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
	}
	return points;
}
