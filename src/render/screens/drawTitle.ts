import { config } from '../../config';
import { drawAddict } from '../characters/drawAddict';
import { drawCop } from '../characters/drawCop';
import { drawHomeless } from '../characters/drawHomeless';
import { drawJanitor } from '../characters/drawJanitor';
import type { Pose } from '../characters/sprite';
import { palette } from '../palette';
import { drawText } from '../text';
import { boardLine, centeredBoard, dimHall, drawBoard } from './board';

type Ctx = CanvasRenderingContext2D;

const BOARD = centeredBoard(1040, 660);
const CENTER_X = BOARD.left + BOARD.width / 2;
const CREW_TOP = 232;
const CREW_ROW_HEIGHT = 58;
const CAST_TOP = 470;
const WALK_SPEED = 55;

/** Who walks in, in the order they start to appear, with what to expect from each. */
const cast: readonly { readonly name: string; readonly hint: string; readonly radius: number }[] = [
	{ name: 'HOMELESS', hint: 'walks straight at you', radius: 20 },
	{ name: 'ADDICT', hint: 'stops, then sprints', radius: 20 },
	{ name: 'COP', hint: 'needs a long soak', radius: 26 },
];

/** The title screen: the crew and their keys, and who is about to walk into the hall. */
export function drawTitle(ctx: Ctx, clock: number): void {
	dimHall(ctx);
	drawBoard(ctx, BOARD, 'ÚKLID · CLEANING CREW');

	boardLine(ctx, BOARD, 'HLAVÁK', 112, 84);
	boardLine(ctx, BOARD, 'SANITATION SQUAD', 172, 26, true);

	const walked = clock * WALK_SPEED;
	drawCrew(ctx, walked);
	drawCast(ctx, walked, clock);

	boardLine(
		ctx,
		BOARD,
		'Keep the sanitizer between you and them. One touch ends the shift.',
		578,
		20,
		true,
	);
	boardLine(ctx, BOARD, 'PRESS ENTER TO START THE SHIFT', 620, 30);
}

/** One row per janitor: the janitor, their name, their keys. */
function drawCrew(ctx: Ctx, walked: number): void {
	config.keys.players.forEach((keys, id) => {
		const y = BOARD.top + CREW_TOP + id * CREW_ROW_HEIGHT;
		const color = palette.players[id];
		const label = String(id + 1);

		drawJanitor(ctx, standing(CENTER_X - 270, y, 15, walked), color, label);
		drawText(ctx, `JANITOR ${label}`, CENTER_X - 220, y, {
			size: 30,
			color,
			bold: true,
		});
		drawText(ctx, keys.label, CENTER_X + 90, y, {
			size: 30,
			color: palette.boardAmber,
			bold: true,
		});
	});
}

/** The three kinds of visitor side by side, each with a name and a one-line warning. */
function drawCast(ctx: Ctx, walked: number, clock: number): void {
	const columnWidth = BOARD.width / cast.length;
	const y = BOARD.top + CAST_TOP;
	const drawers = [
		(pose: Pose) => drawHomeless(ctx, pose),
		(pose: Pose) => drawAddict(ctx, pose, Math.floor(clock) % 3 === 0, clock),
		(pose: Pose) => drawCop(ctx, pose),
	];

	cast.forEach((member, index) => {
		const x = BOARD.left + columnWidth * (index + 0.5);
		drawers[index](standing(x, y - 28, member.radius, walked));
		drawText(ctx, member.name, x, y + 24, {
			size: 24,
			color: palette.boardAmber,
			align: 'center',
			bold: true,
		});
		drawText(ctx, member.hint, x, y + 52, {
			size: 18,
			color: palette.boardDim,
			align: 'center',
		});
	});
}

/** A character walking on the spot, looking right. */
function standing(x: number, y: number, radius: number, walked: number): Pose {
	return { position: { x, y }, radius, facing: 0, walked };
}
