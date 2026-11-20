import { config } from '../../config';
import { drawText } from '../text';

export interface DebugInfo {
	readonly fps: number;
	readonly enemyCount: number;
	/** Which wave, which phase, and how many of it have still to walk in. */
	readonly wave: string;
	/** Lets players check that the keyboard registers all of them at once. */
	readonly heldKeys: readonly string[];
}

const TEXT_COLOR = '#4ade80';
const PANEL_COLOR = 'rgba(0, 0, 0, 0.78)';
const LINE_HEIGHT = 24;
const PANEL_WIDTH = 520;
const RIGHT = config.arena.width - 60;
const TOP = 58;

export function drawDebug(ctx: CanvasRenderingContext2D, info: DebugInfo): void {
	const lines = [
		`FPS ${info.fps.toFixed(0)}`,
		`ENEMIES ${info.enemyCount}`,
		`WAVE ${info.wave}`,
		`KEYS ${info.heldKeys.join(' ') || '-'}`,
	];

	ctx.fillStyle = PANEL_COLOR;
	ctx.fillRect(RIGHT - PANEL_WIDTH, TOP, PANEL_WIDTH, lines.length * LINE_HEIGHT + 16);
	lines.forEach((line, index) => {
		drawText(ctx, line, RIGHT - 12, TOP + 20 + index * LINE_HEIGHT, {
			size: 18,
			color: TEXT_COLOR,
			align: 'right',
		});
	});
}
