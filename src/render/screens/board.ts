import { config } from '../../config';
import { palette } from '../palette';
import { drawText, type TextStyle } from '../text';

export interface Board {
	readonly left: number;
	readonly top: number;
	readonly width: number;
	readonly height: number;
}

/** Height of the blue strip across the top of a board. */
export const BOARD_HEADER_HEIGHT = 46;

const STATION_NAME = 'PRAHA HLAVNÍ NÁDRAŽÍ';
const CORNER = 12;
const DROP_SHADOW = 'rgba(0, 0, 0, 0.45)';
const HALL_DIM_COLOR = 'rgba(20, 14, 8, 0.6)';

/** A board of the given size in the middle of the hall. */
export function centeredBoard(width: number, height: number): Board {
	return {
		left: (config.arena.width - width) / 2,
		top: (config.arena.height - height) / 2,
		width,
		height,
	};
}

/** Darkens the hall so a board in front of it is easy to read. */
export function dimHall(ctx: CanvasRenderingContext2D): void {
	ctx.fillStyle = HALL_DIM_COLOR;
	ctx.fillRect(0, 0, config.arena.width, config.arena.height);
}

/**
 * A station departure board: black panel, blue strip with the station name on the left and
 * `caption` on the right.
 */
export function drawBoard(ctx: CanvasRenderingContext2D, board: Board, caption: string): void {
	const { left, top, width, height } = board;

	ctx.fillStyle = DROP_SHADOW;
	ctx.beginPath();
	ctx.roundRect(left + 8, top + 10, width, height, CORNER);
	ctx.fill();

	ctx.fillStyle = palette.boardPanel;
	ctx.strokeStyle = palette.boardEdge;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.roundRect(left, top, width, height, CORNER);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = palette.signBlue;
	ctx.beginPath();
	ctx.roundRect(left + 2, top + 2, width - 4, BOARD_HEADER_HEIGHT, [
		CORNER - 2,
		CORNER - 2,
		0,
		0,
	]);
	ctx.fill();

	const middle = top + 2 + BOARD_HEADER_HEIGHT / 2;
	const header: TextStyle = { size: 22, color: palette.signText, bold: true };
	drawText(ctx, STATION_NAME, left + 22, middle, header);
	drawText(ctx, caption, left + width - 22, middle, { ...header, align: 'right' });
}

/** Amber board lettering, centred on the board, `offsetY` below its top edge. */
export function boardLine(
	ctx: CanvasRenderingContext2D,
	board: Board,
	text: string,
	offsetY: number,
	size: number,
	dim = false,
): void {
	drawText(ctx, text, board.left + board.width / 2, board.top + offsetY, {
		size,
		color: dim ? palette.boardDim : palette.boardAmber,
		align: 'center',
		bold: true,
	});
}
