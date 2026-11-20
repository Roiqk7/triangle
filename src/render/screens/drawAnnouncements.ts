import { config } from '../../config';
import type { World } from '../../world/World';
import { palette } from '../palette';
import { drawSign } from '../station/drawSign';
import { boardLine, drawBoard, type Board } from './board';
import { newsForWave } from './waveNews';

const CENTER_X = config.arena.width / 2;
const BANNER: Board = { left: CENTER_X - 480, top: 64, width: 960, height: 172 };
const ALERT_Y = 84;
const ALERT_COLOR = '#dc2626';

/**
 * What the station tells the crew while they play: before each wave a board with its number
 * and the one new thing to watch for, and a red sign while a train is on its way.
 */
export function drawAnnouncements(ctx: CanvasRenderingContext2D, world: World, clock: number) {
	if (world.over) return;
	if (world.wave.phase === 'break') drawWaveBanner(ctx, world);
	else if (world.train && world.train.warningLeft > 0) drawTrainAlert(ctx, clock);
}

function drawWaveBanner(ctx: CanvasRenderingContext2D, world: World): void {
	const { number, breakLeft } = world.wave;
	const caption =
		number === 1
			? 'ZAČÁTEK SMĚNY · SHIFT STARTS'
			: `VLNA ${number - 1} HOTOVA · WAVE ${number - 1} CLEARED`;

	drawBoard(ctx, BANNER, caption);
	boardLine(ctx, BANNER, `WAVE ${number}`, 92, 48);
	boardLine(ctx, BANNER, newsForWave(number), 136, 19, true);
	drawCountdown(
		ctx,
		breakLeft /
			(number === 1 ? config.waves.firstBreakSeconds : config.waves.breakSeconds),
	);
}

/** A thin amber bar along the bottom of the banner that runs out as the wave gets near. */
function drawCountdown(ctx: CanvasRenderingContext2D, share: number): void {
	const width = (BANNER.width - 60) * Math.min(1, Math.max(0, share));
	ctx.fillStyle = palette.boardAmber;
	ctx.fillRect(CENTER_X - width / 2, BANNER.top + BANNER.height - 16, width, 5);
}

function drawTrainAlert(ctx: CanvasRenderingContext2D, clock: number): void {
	if (Math.sin(clock * 16) < -0.3) return;
	drawSign(ctx, 'POZOR, VLAK!  ·  TRAIN COMING', CENTER_X, ALERT_Y, { fill: ALERT_COLOR });
}
