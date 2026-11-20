import { config, type EnemyKind } from '../config';
import { add, scale } from '../math/vec2';
import type { Enemy } from '../world/Enemy';
import { drawAddict } from './characters/drawAddict';
import { drawCop } from './characters/drawCop';
import { drawHomeless } from './characters/drawHomeless';
import { palette } from './palette';

type EnemyDrawer = (ctx: CanvasRenderingContext2D, enemy: Enemy, clock: number) => void;

/** Who each kind of enemy is in this theme. The rules only know the kind. */
const cast: Record<EnemyKind, EnemyDrawer> = {
	chaser: (ctx, enemy) => drawHomeless(ctx, enemy),
	dasher: (ctx, enemy, clock) => drawAddict(ctx, enemy, enemy.aim !== null, clock),
	brute: (ctx, enemy) => drawCop(ctx, enemy),
};

const WARNING_COLOR = 'rgba(124, 58, 237, 0.8)';
const WARNING_DASH = [10, 9];
const BAR_HEIGHT = 6;
const BAR_BACK_COLOR = 'rgba(35, 31, 32, 0.75)';

export function drawEnemies(
	ctx: CanvasRenderingContext2D,
	enemies: readonly Enemy[],
	clock: number,
): void {
	for (const enemy of enemies) {
		drawSprintWarning(ctx, enemy);
		cast[enemy.kind](ctx, enemy, clock);
		drawDryBar(ctx, enemy);
	}
}

/** A dashed line showing where someone about to sprint is going to go. */
function drawSprintWarning(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
	if (!enemy.aim) return;
	const sprintLength = config.dash.dashSpeed * config.dash.dashSeconds;
	const end = add(enemy.position, scale(enemy.aim, sprintLength));

	ctx.save();
	ctx.strokeStyle = WARNING_COLOR;
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';
	ctx.setLineDash(WARNING_DASH);
	ctx.beginPath();
	ctx.moveTo(enemy.position.x, enemy.position.y);
	ctx.lineTo(end.x, end.y);
	ctx.stroke();
	ctx.restore();
}

/** Only for enemies that need a long soak: how much of them is still dry. */
function drawDryBar(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
	if (enemy.maxHp <= 1) return;
	const width = enemy.radius * 2.4;
	const left = enemy.position.x - width / 2;
	const top = enemy.position.y - enemy.radius * 1.9 - BAR_HEIGHT;

	ctx.fillStyle = BAR_BACK_COLOR;
	ctx.fillRect(left - 2, top - 2, width + 4, BAR_HEIGHT + 4);
	ctx.fillStyle = palette.sanitizer;
	ctx.fillRect(left, top, width * Math.max(0, enemy.hp / enemy.maxHp), BAR_HEIGHT);
}
