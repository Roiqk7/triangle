import { config } from '../../config';
import { palette } from '../palette';
import { drawSign } from './drawSign';

const { width: WIDTH, height: HEIGHT } = config.arena;

/** How far each entrance reaches into the hall from its wall. */
export const ENTRANCE_DEPTH = 44;

const STAIRS_COLOR = '#5b554e';
const STAIR_EDGE_COLOR = '#8a8278';
const MAT_COLOR = '#4a443e';
const GLASS_COLOR = 'rgba(186, 230, 253, 0.75)';
const DOOR_FRAME_COLOR = '#2c2825';
const PLATFORM_COUNT = 7;
const DOOR_COUNT = 8;

/**
 * The four ways into the hall, one per wall. Everyone the crew has to deal with walks in
 * through one of these: stairs from the platforms, doors from the park, the metro, the street.
 */
export function drawEntrances(ctx: CanvasRenderingContext2D): void {
	drawPlatformStairs(ctx);
	drawParkDoors(ctx);
	drawSideMat(ctx, 0);
	drawSideMat(ctx, WIDTH - ENTRANCE_DEPTH);

	drawSign(ctx, 'METRO C', ENTRANCE_DEPTH / 2, HEIGHT / 2, {
		fill: '#b91c1c',
		vertical: true,
	});
	drawSign(ctx, 'TAXI', WIDTH - ENTRANCE_DEPTH / 2, HEIGHT / 2 - 150, {
		fill: '#facc15',
		text: '#1c1917',
		vertical: true,
	});
	drawSign(ctx, 'WILSONOVA', WIDTH - ENTRANCE_DEPTH / 2, HEIGHT / 2 + 130, {
		vertical: true,
	});
}

/** Top wall: steps up to the platforms, with a numbered blue sign over each stairway. */
function drawPlatformStairs(ctx: CanvasRenderingContext2D): void {
	ctx.fillStyle = STAIRS_COLOR;
	ctx.fillRect(0, 0, WIDTH, ENTRANCE_DEPTH);

	ctx.strokeStyle = STAIR_EDGE_COLOR;
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let y = 11; y < ENTRANCE_DEPTH; y += 11) {
		ctx.moveTo(0, y);
		ctx.lineTo(WIDTH, y);
	}
	ctx.stroke();

	const spacing = WIDTH / (PLATFORM_COUNT + 1);
	for (let platform = 1; platform <= PLATFORM_COUNT; platform++) {
		drawSign(ctx, String(platform), platform * spacing, ENTRANCE_DEPTH / 2, {
			width: 52,
		});
	}
	drawSign(ctx, 'NÁSTUPIŠTĚ', spacing / 2, ENTRANCE_DEPTH / 2, { fill: palette.outline });
}

/** Bottom wall: a row of glass doors to the park in front of the station. */
function drawParkDoors(ctx: CanvasRenderingContext2D): void {
	const top = HEIGHT - ENTRANCE_DEPTH;
	ctx.fillStyle = MAT_COLOR;
	ctx.fillRect(0, top, WIDTH, ENTRANCE_DEPTH);

	const doorWidth = WIDTH / DOOR_COUNT;
	for (let door = 0; door < DOOR_COUNT; door++) {
		ctx.fillStyle = GLASS_COLOR;
		ctx.fillRect(door * doorWidth + 14, HEIGHT - 16, doorWidth - 28, 10);
		ctx.fillStyle = DOOR_FRAME_COLOR;
		ctx.fillRect(door * doorWidth - 4, HEIGHT - 20, 8, 20);
	}
	drawSign(ctx, 'VRCHLICKÉHO SADY · SHERWOOD', WIDTH / 2, top + 15, { fill: '#166534' });
}

/** Left and right walls: a dark rubber mat along the whole wall. */
function drawSideMat(ctx: CanvasRenderingContext2D, left: number): void {
	ctx.fillStyle = MAT_COLOR;
	ctx.fillRect(left, ENTRANCE_DEPTH, ENTRANCE_DEPTH, HEIGHT - 2 * ENTRANCE_DEPTH);

	ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	for (let x = left + 8; x < left + ENTRANCE_DEPTH; x += 8) {
		ctx.moveTo(x, ENTRANCE_DEPTH);
		ctx.lineTo(x, HEIGHT - ENTRANCE_DEPTH);
	}
	ctx.stroke();
}
