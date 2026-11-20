import { config } from '../config';
import type { Splash } from '../world/Splash';
import { palette } from './palette';

const BUBBLES = 9;

/**
 * A burst of foam where someone was washed away: a ring that grows and thins, and bubbles
 * flying outwards. `time` is the world's clock, so the burst freezes while the game is paused.
 */
export function drawSplashes(
	ctx: CanvasRenderingContext2D,
	splashes: readonly Splash[],
	time: number,
): void {
	for (const splash of splashes) {
		const progress = (time - splash.startedAt) / config.splash.seconds;
		if (progress < 0 || progress >= 1) continue;
		drawSplash(ctx, splash, progress);
	}
}

function drawSplash(ctx: CanvasRenderingContext2D, splash: Splash, progress: number): void {
	const { x, y } = splash.position;
	const fade = 1 - progress;
	const reach = splash.radius * (1 + progress * 2.4);

	ctx.save();
	ctx.globalAlpha = fade;
	ctx.strokeStyle = palette.sanitizer;
	ctx.lineWidth = 1 + fade * 5;
	ctx.beginPath();
	ctx.arc(x, y, reach, 0, Math.PI * 2);
	ctx.stroke();

	ctx.fillStyle = palette.foam;
	ctx.lineWidth = 1;
	for (let i = 0; i < BUBBLES; i++) {
		const angle = (i / BUBBLES) * Math.PI * 2 + splash.startedAt;
		const distance = reach * (0.55 + 0.45 * ((i * 7) % 3) * 0.5);
		ctx.beginPath();
		ctx.arc(
			x + Math.cos(angle) * distance,
			y + Math.sin(angle) * distance,
			2 + fade * 4,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.stroke();
	}
	ctx.restore();
}
