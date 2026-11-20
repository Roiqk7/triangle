import { config } from '../../config';

const { width: WIDTH, height: HEIGHT } = config.arena;
const SHAFT_STARTS = [130, 520, 910, 1300];
const SHAFT_WIDTH = 150;
const SHAFT_SLANT = 240;

/** Daylight from the roof windows, falling across the floor in slanted bands. */
export function drawLightShafts(ctx: CanvasRenderingContext2D): void {
	const fade = ctx.createLinearGradient(0, 0, 0, HEIGHT);
	fade.addColorStop(0, 'rgba(255, 250, 230, 0.16)');
	fade.addColorStop(1, 'rgba(255, 250, 230, 0.03)');
	ctx.fillStyle = fade;

	for (const start of SHAFT_STARTS) {
		ctx.beginPath();
		ctx.moveTo(start, 0);
		ctx.lineTo(start + SHAFT_WIDTH, 0);
		ctx.lineTo(start + SHAFT_WIDTH + SHAFT_SLANT, HEIGHT);
		ctx.lineTo(start + SHAFT_SLANT, HEIGHT);
		ctx.closePath();
		ctx.fill();
	}
}

/** Darker corners, so the eye stays in the middle of the hall. */
export function drawVignette(ctx: CanvasRenderingContext2D): void {
	const centerX = WIDTH / 2;
	const centerY = HEIGHT / 2;
	const reach = Math.hypot(centerX, centerY);

	const shade = ctx.createRadialGradient(
		centerX,
		centerY,
		reach * 0.5,
		centerX,
		centerY,
		reach,
	);
	shade.addColorStop(0, 'rgba(40, 25, 10, 0)');
	shade.addColorStop(1, 'rgba(40, 25, 10, 0.42)');
	ctx.fillStyle = shade;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
