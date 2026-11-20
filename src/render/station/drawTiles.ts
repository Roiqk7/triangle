import { config } from '../../config';
import { seededRandom } from '../../math/random';

const { width: WIDTH, height: HEIGHT } = config.arena;
const TILE = 100;
const TILE_COLORS = ['#d9d0bf', '#cfc5b2'];
const GROUT_COLOR = '#b5aa94';
/** Fixed seeds, so the floor looks the same every time. */
const SHADE_SEED = 7;
const GRIME_SEED = 11;
const STAIN_COUNT = 46;
const GUM_COUNT = 150;

/** Stone tiles in two alternating shades, each a touch lighter or darker than its neighbours. */
export function drawTiles(ctx: CanvasRenderingContext2D): void {
	const random = seededRandom(SHADE_SEED);

	for (let row = 0; row * TILE < HEIGHT; row++) {
		for (let column = 0; column * TILE < WIDTH; column++) {
			ctx.fillStyle = TILE_COLORS[(row + column) % 2];
			ctx.fillRect(column * TILE, row * TILE, TILE, TILE);

			const shade = random() - 0.5;
			ctx.fillStyle =
				shade > 0
					? `rgba(255,255,255,${shade * 0.16})`
					: `rgba(0,0,0,${-shade * 0.1})`;
			ctx.fillRect(column * TILE, row * TILE, TILE, TILE);
		}
	}
	strokeGrout(ctx);
}

/** Years of footfall: faint stains and dots of old chewing gum. */
export function drawGrime(ctx: CanvasRenderingContext2D): void {
	const random = seededRandom(GRIME_SEED);

	for (let i = 0; i < STAIN_COUNT; i++) {
		ctx.fillStyle = `rgba(70, 50, 30, ${0.03 + random() * 0.05})`;
		ctx.beginPath();
		ctx.ellipse(
			random() * WIDTH,
			random() * HEIGHT,
			12 + random() * 44,
			8 + random() * 26,
			random() * Math.PI,
			0,
			Math.PI * 2,
		);
		ctx.fill();
	}
	for (let i = 0; i < GUM_COUNT; i++) {
		ctx.fillStyle = `rgba(60, 54, 48, ${0.25 + random() * 0.3})`;
		ctx.beginPath();
		ctx.arc(random() * WIDTH, random() * HEIGHT, 1.5 + random() * 2, 0, Math.PI * 2);
		ctx.fill();
	}
}

function strokeGrout(ctx: CanvasRenderingContext2D): void {
	ctx.beginPath();
	for (let x = 0; x <= WIDTH; x += TILE) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, HEIGHT);
	}
	for (let y = 0; y <= HEIGHT; y += TILE) {
		ctx.moveTo(0, y);
		ctx.lineTo(WIDTH, y);
	}
	ctx.strokeStyle = GROUT_COLOR;
	ctx.lineWidth = 2;
	ctx.stroke();
}
