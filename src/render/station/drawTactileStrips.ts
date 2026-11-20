import { config } from '../../config';
import { ENTRANCE_DEPTH } from './drawEntrances';
import { MOSAIC_RADIUS } from './drawMosaic';

const { width: WIDTH, height: HEIGHT } = config.arena;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

const STRIP_WIDTH = 26;
const STRIP_COLOR = '#e0b637';
const GROOVE_COLOR = '#b08a1c';
const GROOVES = 3;
const PAD_SIZE = 46;
const STUDS_PER_SIDE = 4;

/**
 * Yellow guide strips for blind travellers, running from each entrance to the mosaic, with a
 * studded warning pad where each one starts.
 */
export function drawTactileStrips(ctx: CanvasRenderingContext2D): void {
	const gap = MOSAIC_RADIUS + 14;
	strip(ctx, CENTER_X, ENTRANCE_DEPTH, CENTER_X, CENTER_Y - gap);
	strip(ctx, CENTER_X, HEIGHT - ENTRANCE_DEPTH, CENTER_X, CENTER_Y + gap);
	strip(ctx, ENTRANCE_DEPTH, CENTER_Y, CENTER_X - gap, CENTER_Y);
	strip(ctx, WIDTH - ENTRANCE_DEPTH, CENTER_Y, CENTER_X + gap, CENTER_Y);
}

/** A straight strip, either vertical or horizontal, starting with a warning pad. */
function strip(
	ctx: CanvasRenderingContext2D,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
) {
	const vertical = fromX === toX;
	const half = STRIP_WIDTH / 2;

	ctx.fillStyle = STRIP_COLOR;
	if (vertical)
		ctx.fillRect(
			fromX - half,
			Math.min(fromY, toY),
			STRIP_WIDTH,
			Math.abs(toY - fromY),
		);
	else ctx.fillRect(Math.min(fromX, toX), fromY - half, Math.abs(toX - fromX), STRIP_WIDTH);

	ctx.strokeStyle = GROOVE_COLOR;
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let i = 1; i <= GROOVES; i++) {
		const offset = -half + (i * STRIP_WIDTH) / (GROOVES + 1);
		ctx.moveTo(fromX + (vertical ? offset : 0), fromY + (vertical ? 0 : offset));
		ctx.lineTo(toX + (vertical ? offset : 0), toY + (vertical ? 0 : offset));
	}
	ctx.stroke();

	const towardsEndX = Math.sign(toX - fromX) * (PAD_SIZE / 2);
	const towardsEndY = Math.sign(toY - fromY) * (PAD_SIZE / 2);
	warningPad(ctx, fromX + towardsEndX, fromY + towardsEndY);
}

function warningPad(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
	const left = centerX - PAD_SIZE / 2;
	const top = centerY - PAD_SIZE / 2;
	const spacing = PAD_SIZE / STUDS_PER_SIDE;

	ctx.fillStyle = STRIP_COLOR;
	ctx.fillRect(left, top, PAD_SIZE, PAD_SIZE);
	ctx.fillStyle = GROOVE_COLOR;
	for (let row = 0; row < STUDS_PER_SIDE; row++) {
		for (let column = 0; column < STUDS_PER_SIDE; column++) {
			ctx.beginPath();
			ctx.arc(
				left + (column + 0.5) * spacing,
				top + (row + 0.5) * spacing,
				2.6,
				0,
				Math.PI * 2,
			);
			ctx.fill();
		}
	}
}
