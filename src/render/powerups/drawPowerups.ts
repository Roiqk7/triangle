import { config } from '../../config';
import type { Powerup } from '../../world/Powerup';
import { palette } from '../palette';
import { disc, oval } from '../shapes';
import { drawPowerupIcon, powerupColors } from './drawPowerupIcon';

const RADIUS = config.powerups.radius;
/** A power-up starts to blink this many seconds before it disappears. */
const BLINK_SECONDS = 4;
const TOKEN_COLOR = '#fffbeb';

/**
 * Power-ups on the floor: a pale token with a coloured ring and a pictogram, gently
 * pulsing so it catches the eye, and blinking when it is about to disappear.
 */
export function drawPowerups(
	ctx: CanvasRenderingContext2D,
	powerups: readonly Powerup[],
	time: number,
	clock: number,
): void {
	for (const powerup of powerups) {
		const left = config.powerups.lifeSeconds - (time - powerup.spawnedAt);
		if (left < BLINK_SECONDS && Math.sin(clock * 18) < 0) continue;

		const { x, y } = powerup.position;
		const pulse = 1 + 0.08 * Math.sin(clock * 5 + x);
		const color = powerupColors[powerup.kind];

		oval(ctx, x + 3, y + 5, RADIUS * 1.05, RADIUS, palette.shadow, false);
		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.globalAlpha = 0.5;
		ctx.beginPath();
		ctx.arc(x, y, RADIUS * (1.25 + 0.2 * Math.sin(clock * 5 + x)), 0, Math.PI * 2);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.lineWidth = 4;
		disc(ctx, x, y, RADIUS * pulse, TOKEN_COLOR);
		ctx.restore();

		drawPowerupIcon(ctx, powerup.kind, x, y, (RADIUS / 14) * pulse);
	}
}
