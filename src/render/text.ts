export interface TextStyle {
	readonly size: number;
	readonly color?: string;
	readonly align?: CanvasTextAlign;
	readonly bold?: boolean;
}

const DEFAULT_COLOR = '#e5e7eb';
const FONT_FAMILY = 'ui-monospace, Menlo, Consolas, monospace';

export function drawText(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	style: TextStyle,
): void {
	ctx.font = `${style.bold ? 'bold ' : ''}${style.size}px ${FONT_FAMILY}`;
	ctx.fillStyle = style.color ?? DEFAULT_COLOR;
	ctx.textAlign = style.align ?? 'left';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x, y);
}

/** Seconds as m:ss.t, for example 1:07.4 */
export function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const rest = (seconds - minutes * 60).toFixed(1).padStart(4, '0');
	return `${minutes}:${rest}`;
}
