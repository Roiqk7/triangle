import type { Phase } from '../../Game';
import type { World } from '../../world/World';
import { formatTime } from '../text';
import { boardLine, centeredBoard, dimHall, drawBoard } from './board';
import { drawAnnouncements } from './drawAnnouncements';
import { drawHud } from './drawHud';
import { drawTitle } from './drawTitle';

type Ctx = CanvasRenderingContext2D;
type ScreenDrawer = (ctx: Ctx, world: World, clock: number) => void;

const screens: Record<Phase, ScreenDrawer> = {
	title: (ctx, _world, clock) => drawTitle(ctx, clock),
	playing: drawPlaying,
	paused: drawPaused,
	gameOver: drawShiftOver,
};

const SMALL_BOARD = centeredBoard(640, 250);
const RESULT_BOARD = centeredBoard(760, 420);

/** Draws the text layer for the current phase on top of the hall. */
export function drawScreen(ctx: Ctx, phase: Phase, world: World, clock: number): void {
	screens[phase](ctx, world, clock);
}

function drawPlaying(ctx: Ctx, world: World, clock: number): void {
	drawHud(ctx, world);
	drawAnnouncements(ctx, world, clock);
}

function drawPaused(ctx: Ctx, world: World): void {
	drawHud(ctx, world);
	dimHall(ctx);
	drawBoard(ctx, SMALL_BOARD, 'PŘESTÁVKA · BREAK');
	boardLine(ctx, SMALL_BOARD, 'SHIFT PAUSED', 130, 60);
	boardLine(ctx, SMALL_BOARD, 'Press P to get back to work', 200, 24, true);
}

function drawShiftOver(ctx: Ctx, world: World): void {
	dimHall(ctx);
	drawBoard(ctx, RESULT_BOARD, 'KONEC SMĚNY · END OF SHIFT');
	boardLine(ctx, RESULT_BOARD, 'SHIFT OVER', 122, 68);
	boardLine(ctx, RESULT_BOARD, 'Somebody got to a janitor.', 176, 22, true);
	boardLine(ctx, RESULT_BOARD, `Reached wave   ${world.wave.number}`, 232, 32);
	boardLine(ctx, RESULT_BOARD, `Time on shift   ${formatTime(world.time)}`, 278, 32);
	boardLine(ctx, RESULT_BOARD, `Washed away   ${world.kills}`, 324, 32);
	boardLine(ctx, RESULT_BOARD, 'PRESS ENTER FOR A NEW SHIFT', 382, 26);
}
