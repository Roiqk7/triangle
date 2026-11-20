import { config, type EffectKind } from '../../config';
import type { World } from '../../world/World';
import { palette } from '../palette';
import { drawPowerupIcon, powerupColors } from '../powerups/drawPowerupIcon';
import { drawText, formatTime } from '../text';

type Ctx = CanvasRenderingContext2D;

const HUD = { left: 60, top: 58, width: 250, rowHeight: 32, padding: 14 };
const EFFECT_ROW_HEIGHT = 34;
const EFFECT_BAR_WIDTH = 150;

/** A small board in the corner: time on shift, wave, how many were washed away. */
export function drawHud(ctx: Ctx, world: World): void {
	const rows: readonly [string, string][] = [
		['SHIFT', formatTime(world.time)],
		['WAVE', String(world.wave.number)],
		['WASHED', String(world.kills)],
	];
	const height = rows.length * HUD.rowHeight + HUD.padding * 2 - 8;
	panel(ctx, HUD.top, height);

	rows.forEach(([label, value], index) => {
		const y = HUD.top + HUD.padding + 12 + index * HUD.rowHeight;
		drawText(ctx, label, HUD.left + 18, y, {
			size: 22,
			color: palette.boardDim,
			bold: true,
		});
		drawText(ctx, value, HUD.left + HUD.width - 18, y, {
			size: 24,
			color: palette.boardAmber,
			align: 'right',
			bold: true,
		});
	});
	drawPowerupStatus(ctx, world, HUD.top + height + 10);
}

/** Under the board: one row per running effect with a bar for the time left, then shields. */
function drawPowerupStatus(ctx: Ctx, world: World, top: number): void {
	const running = (Object.keys(world.effects) as EffectKind[]).filter(
		(effect) => world.effects[effect] > 0,
	);
	const rows = running.length + (world.shields > 0 ? 1 : 0);
	if (rows === 0) return;
	panel(ctx, top, rows * EFFECT_ROW_HEIGHT + 10);

	running.forEach((effect, index) => {
		const y = top + 5 + EFFECT_ROW_HEIGHT * (index + 0.5);
		const share = world.effects[effect] / config.powerups.effectSeconds[effect];
		drawPowerupIcon(ctx, effect, HUD.left + 30, y, 1.25);
		ctx.fillStyle = palette.boardEdge;
		ctx.fillRect(HUD.left + 62, y - 5, EFFECT_BAR_WIDTH, 10);
		ctx.fillStyle = powerupColors[effect];
		ctx.fillRect(HUD.left + 62, y - 5, EFFECT_BAR_WIDTH * share, 10);
	});

	const y = top + 5 + EFFECT_ROW_HEIGHT * (running.length + 0.5);
	for (let shield = 0; shield < world.shields; shield++) {
		drawPowerupIcon(ctx, 'shield', HUD.left + 30 + shield * 32, y, 1.25);
	}
}

function panel(ctx: Ctx, top: number, height: number): void {
	ctx.fillStyle = palette.boardPanel;
	ctx.strokeStyle = palette.boardEdge;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.roundRect(HUD.left, top, HUD.width, height, 8);
	ctx.fill();
	ctx.stroke();
}
