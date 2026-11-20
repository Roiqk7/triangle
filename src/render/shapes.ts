/**
 * Small filled shapes. Each is filled with `fill` and, unless `outlined` is false, stroked
 * with whatever stroke style and line width the canvas currently has.
 */
type Ctx = CanvasRenderingContext2D;

export function disc(
	ctx: Ctx,
	x: number,
	y: number,
	radius: number,
	fill: string,
	outlined = true,
) {
	oval(ctx, x, y, radius, radius, fill, outlined);
}

export function oval(
	ctx: Ctx,
	x: number,
	y: number,
	radiusX: number,
	radiusY: number,
	fill: string,
	outlined = true,
): void {
	ctx.beginPath();
	ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
	paint(ctx, fill, outlined);
}

export function box(
	ctx: Ctx,
	x: number,
	y: number,
	width: number,
	height: number,
	corner: number,
	fill: string,
	outlined = true,
): void {
	ctx.beginPath();
	ctx.roundRect(x, y, width, height, corner);
	paint(ctx, fill, outlined);
}

/** A closed shape through the given points, listed as x1, y1, x2, y2, … */
export function polygon(ctx: Ctx, points: readonly number[], fill: string, outlined = true): void {
	ctx.beginPath();
	for (let i = 0; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
	ctx.closePath();
	paint(ctx, fill, outlined);
}

export function line(
	ctx: Ctx,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	color: string,
	width: number,
): void {
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX, toY);
	ctx.stroke();
	ctx.restore();
}

function paint(ctx: Ctx, fill: string, outlined: boolean): void {
	ctx.fillStyle = fill;
	ctx.fill();
	if (outlined) ctx.stroke();
}
