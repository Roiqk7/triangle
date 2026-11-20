import { config } from '../config';
import { distance, type Vec2 } from '../math/vec2';
import type { Laser } from '../world/Laser';
import { blend, type Rgb } from './colors';
import { palette } from './palette';

const { strainFrom, snapSeconds } = config.laser;

const RELAXED: Rgb = [45, 212, 191];
const STRAINED: Rgb = [234, 88, 12];
const OVERSTRETCHED: Rgb = [220, 38, 38];
const EDGE_COLOR = 'rgba(35, 31, 32, 0.35)';
const BLOCKED_COLOR = '#f59e0b';
const DRIP_COLOR = 'rgba(13, 148, 136, 0.8)';
const BLOCKED_DASH = [12, 10];
const DRIP_DASH = [2, 15];
const BLOCKED_DASH_SPEED = 70;
const BUBBLE_SPACING = 44;
const BUBBLE_SPEED = 110;

/**
 * The sanitizer between the janitors (a `Laser` in the rules). A working stream is a thick
 * jet with bubbles running along it. As it nears its limit it thins and turns from mint to
 * amber; past the limit it turns red and blinks faster and faster until it snaps. A cut or
 * snapped stream is only a broken line.
 */
export function drawStreams(
	ctx: CanvasRenderingContext2D,
	streams: readonly Laser[],
	halfWidth: number,
	clock: number,
): void {
	for (const stream of streams) {
		ctx.save();
		ctx.lineCap = 'round';
		if (stream.active) drawJet(ctx, stream, halfWidth, clock);
		else if (stream.blocked)
			drawBroken(ctx, stream, BLOCKED_COLOR, BLOCKED_DASH, clock);
		else drawBroken(ctx, stream, DRIP_COLOR, DRIP_DASH, 0);
		ctx.restore();
	}
}

function drawJet(ctx: CanvasRenderingContext2D, stream: Laser, halfWidth: number, clock: number) {
	/** 0 while relaxed, rising to 1 at the max length. */
	const strain = Math.min(1, Math.max(0, (stream.strain - strainFrom) / (1 - strainFrom)));
	/** 0 within range, rising to 1 at the moment it snaps. */
	const danger = stream.strain > 1 ? stream.overstretch / snapSeconds : 0;

	const width = halfWidth * 2 * (1 - 0.35 * strain);
	if (danger > 0) ctx.globalAlpha = 0.45 + 0.55 * blink(clock, 5 + danger * 16);

	strokeLine(ctx, stream, jetColor(strain, danger, 0.3), width + 8);
	strokeLine(ctx, stream, EDGE_COLOR, width + 3.5);
	strokeLine(ctx, stream, jetColor(strain, danger, 1), width + 1);
	strokeLine(ctx, stream, palette.sanitizerLight, Math.max(1.5, width * 0.4));
	if (danger === 0) drawBubbles(ctx, stream.from, stream.to, clock, 1 + strain);
}

/** Mint while relaxed, amber at the limit, red once past it. */
function jetColor(strain: number, danger: number, opacity: number): string {
	if (danger > 0) return blend(OVERSTRETCHED, OVERSTRETCHED, 0, opacity);
	return blend(RELAXED, STRAINED, strain, opacity);
}

/** Switches between 0 and 1, `rate` times a second. */
function blink(clock: number, rate: number): number {
	return Math.sin(clock * rate * Math.PI * 2) > 0 ? 1 : 0;
}

/** Foam bubbles travelling along the jet, wobbling from side to side. Fewer under strain. */
function drawBubbles(
	ctx: CanvasRenderingContext2D,
	from: Vec2,
	to: Vec2,
	clock: number,
	sparseness: number,
): void {
	const length = distance(from, to);
	if (length === 0) return;
	const alongX = (to.x - from.x) / length;
	const alongY = (to.y - from.y) / length;
	const spacing = BUBBLE_SPACING * sparseness;

	ctx.fillStyle = palette.foam;
	ctx.strokeStyle = palette.sanitizer;
	ctx.lineWidth = 1;
	for (let at = (clock * BUBBLE_SPEED) % spacing; at < length; at += spacing) {
		const wobble = Math.sin(at * 0.21 + clock * 6) * 4;
		const radius = 2.2 + 1.4 * Math.abs(Math.sin(at * 0.13));
		ctx.beginPath();
		ctx.arc(
			from.x + alongX * at - alongY * wobble,
			from.y + alongY * at + alongX * wobble,
			radius,
			0,
			Math.PI * 2,
		);
		ctx.fill();
		ctx.stroke();
	}
}

/** Moving amber dashes when something is in the way; still drips when it has snapped. */
function drawBroken(
	ctx: CanvasRenderingContext2D,
	stream: Laser,
	color: string,
	dash: number[],
	clock: number,
): void {
	ctx.setLineDash(dash);
	ctx.lineDashOffset = -clock * BLOCKED_DASH_SPEED;
	strokeLine(ctx, stream, color, 5);
}

function strokeLine(ctx: CanvasRenderingContext2D, stream: Laser, color: string, width: number) {
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(stream.from.x, stream.from.y);
	ctx.lineTo(stream.to.x, stream.to.y);
	ctx.stroke();
}
