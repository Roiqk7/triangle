import { config } from '../config';
import { isRunning, laserHalfWidth } from '../systems/modifiers';
import type { World } from '../world/World';
import { drawEnemies } from './drawEnemies';
import { drawPlayers } from './drawPlayers';
import { drawSplashes } from './drawSplashes';
import { drawStreams } from './drawStreams';
import { drawTrain, drawTrainWarning } from './drawTrain';
import { drawPowerups } from './powerups/drawPowerups';
import { drawObstacles } from './props/drawObstacles';
import { createStationFloor } from './station/createStationFloor';

const { width: WIDTH, height: HEIGHT } = config.arena;
const WALL_COLOR = '#2b2420';
const WALL_TRIM_COLOR = '#8b7b6b';
const WALL_THICKNESS = 14;
const WET_FLOOR_SHEEN = 'rgba(56, 189, 248, 0.14)';

/** Draws the station hall and everyone in it. Owns the floor picture, painted once. */
export class WorldRenderer {
	private readonly floor = createStationFloor();

	/**
	 * Draws one frame, back to front. `clock` is seconds of real time and only drives
	 * animation; it never affects the game rules.
	 */
	draw(ctx: CanvasRenderingContext2D, world: World, clock: number): void {
		ctx.save();
		this.clipToHall(ctx);
		ctx.drawImage(this.floor, 0, 0, WIDTH, HEIGHT);
		if (isRunning(world, 'wetFloor')) this.drawSheen(ctx);
		drawTrainWarning(ctx, world.train, clock);
		drawPowerups(ctx, world.powerups, world.time, clock);
		drawStreams(ctx, world.lasers, laserHalfWidth(world), clock);
		drawSplashes(ctx, world.splashes, world.time);
		drawEnemies(ctx, world.enemies, clock);
		drawPlayers(ctx, world, clock);
		drawObstacles(ctx, world.obstacles, clock);
		drawTrain(ctx, world.train);
		ctx.restore();

		this.drawWalls(ctx);
	}

	/** People walk in from outside the hall; they only become visible once they are inside. */
	private clipToHall(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.rect(0, 0, WIDTH, HEIGHT);
		ctx.clip();
	}

	/** A blue shine over the whole floor while it is wet. */
	private drawSheen(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = WET_FLOOR_SHEEN;
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
	}

	private drawWalls(ctx: CanvasRenderingContext2D): void {
		const half = WALL_THICKNESS / 2;
		ctx.strokeStyle = WALL_COLOR;
		ctx.lineWidth = WALL_THICKNESS;
		ctx.strokeRect(-half, -half, WIDTH + WALL_THICKNESS, HEIGHT + WALL_THICKNESS);
		ctx.strokeStyle = WALL_TRIM_COLOR;
		ctx.lineWidth = 2;
		ctx.strokeRect(0, 0, WIDTH, HEIGHT);
	}
}
