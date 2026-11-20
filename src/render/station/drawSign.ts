import { palette } from '../palette';
import { drawText } from '../text';

export interface SignStyle {
	/** Background colour. Railway blue unless given. */
	readonly fill?: string;
	/** Letter colour. White unless given. */
	readonly text?: string;
	/** Fixed width. Otherwise the sign is as wide as its text needs. */
	readonly width?: number;
	/** Turned a quarter, to read along a side wall. */
	readonly vertical?: boolean;
}

const HEIGHT = 28;
const FONT_SIZE = 18;
const PADDING = 14;
const CHARACTER_WIDTH = FONT_SIZE * 0.62;

/** A station sign: a rounded plate with centred capital letters, centred on (x, y). */
export function drawSign(
	ctx: CanvasRenderingContext2D,
	label: string,
	x: number,
	y: number,
	style: SignStyle = {},
): void {
	const width = style.width ?? label.length * CHARACTER_WIDTH + PADDING * 2;

	ctx.save();
	ctx.translate(x, y);
	if (style.vertical) ctx.rotate(-Math.PI / 2);

	ctx.fillStyle = style.fill ?? palette.signBlue;
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.roundRect(-width / 2, -HEIGHT / 2, width, HEIGHT, 5);
	ctx.fill();
	ctx.stroke();

	drawText(ctx, label, 0, 1, {
		size: FONT_SIZE,
		color: style.text ?? palette.signText,
		align: 'center',
		bold: true,
	});
	ctx.restore();
}
