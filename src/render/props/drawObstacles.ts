import type { Obstacle } from '../../world/Obstacle';
import { palette } from '../palette';
import { oval } from '../shapes';
import { drawKiosk } from './drawKiosk';
import { drawPlanter } from './drawPlanter';
import { drawRecyclingBin } from './drawRecyclingBin';

type PropDrawer = (ctx: CanvasRenderingContext2D, obstacle: Obstacle, clock: number) => void;

/** Which piece of station furniture an obstacle becomes, by size: the first that fits. */
const propsBySize: readonly { readonly upTo: number; readonly draw: PropDrawer }[] = [
	{ upTo: 38, draw: drawRecyclingBin },
	{ upTo: 52, draw: drawPlanter },
	{ upTo: Infinity, draw: drawKiosk },
];

/** Obstacles are round for the rules; here each one is dressed as station furniture. */
export function drawObstacles(
	ctx: CanvasRenderingContext2D,
	obstacles: readonly Obstacle[],
	clock: number,
): void {
	for (const obstacle of obstacles) {
		const { x, y } = obstacle.position;
		const r = obstacle.radius;
		oval(ctx, x + r * 0.12, y + r * 0.18, r * 1.04, r * 1.04, palette.shadow, false);

		ctx.save();
		ctx.strokeStyle = palette.outline;
		ctx.lineWidth = 3;
		ctx.lineJoin = 'round';
		propsBySize.find((prop) => r <= prop.upTo)?.draw(ctx, obstacle, clock);
		ctx.restore();
	}
}
