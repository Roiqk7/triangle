import type { Player } from '../world/Player';
import type { World } from '../world/World';
import { drawJanitor } from './characters/drawJanitor';
import { palette } from './palette';

const RING_RADIUS = 30;
const RING_FILL_OPACITY = 0.18;
const BUBBLE_RADIUS = 36;
const BUBBLE_FILL = 'rgba(186, 230, 253, 0.28)';
const BUBBLE_EDGE = 'rgba(240, 249, 255, 0.95)';
const CAUGHT_COLOR = '#dc2626';

/**
 * Each player is a janitor standing on a ring of their own colour, so they are easy to
 * find. A soap bubble around them means the crew holds a shield; a red ring marks the one
 * who was caught.
 */
export function drawPlayers(ctx: CanvasRenderingContext2D, world: World, clock: number): void {
	for (const player of world.players) {
		const color = palette.players[player.id];
		drawFloorRing(ctx, player, color);
		drawJanitor(ctx, player, color, String(player.id + 1));
		for (let shield = 0; shield < world.shields; shield++) {
			drawBubble(ctx, player, BUBBLE_RADIUS + shield * 7, clock);
		}
		if (world.caught === player.id) drawCaughtMark(ctx, player, clock);
	}
}

function drawFloorRing(ctx: CanvasRenderingContext2D, player: Player, color: string): void {
	ctx.save();
	ctx.beginPath();
	ctx.arc(player.position.x, player.position.y, RING_RADIUS, 0, Math.PI * 2);
	ctx.globalAlpha = RING_FILL_OPACITY;
	ctx.fillStyle = color;
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, player: Player, radius: number, clock: number) {
	const { x, y } = player.position;
	const wobble = 1 + 0.03 * Math.sin(clock * 4 + player.id);

	ctx.save();
	ctx.beginPath();
	ctx.ellipse(x, y, radius * wobble, radius / wobble, 0, 0, Math.PI * 2);
	ctx.fillStyle = BUBBLE_FILL;
	ctx.fill();
	ctx.strokeStyle = BUBBLE_EDGE;
	ctx.lineWidth = 2.5;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x, y, radius * 0.78, -2.4, -1.7);
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.restore();
}

/** A red ring closing in on the player who was caught, during the pause before the result. */
function drawCaughtMark(ctx: CanvasRenderingContext2D, player: Player, clock: number): void {
	const pulse = 0.5 + 0.5 * Math.sin(clock * 14);
	ctx.save();
	ctx.strokeStyle = CAUGHT_COLOR;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.arc(player.position.x, player.position.y, 40 + pulse * 14, 0, Math.PI * 2);
	ctx.stroke();
	ctx.restore();
}
