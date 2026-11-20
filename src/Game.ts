import { config } from './config';
import type { Random } from './math/random';
import type { Vec2 } from './math/vec2';
import { buildLasers } from './systems/buildLasers';
import { step } from './systems/step';
import { generateObstacles } from './world/generateObstacles';
import { createWorld, type World } from './world/World';

export type Phase = 'title' | 'playing' | 'paused' | 'gameOver';

/** Owns the current run and which screen the game is on. */
export class Game {
	private currentPhase: Phase = 'title';
	private currentWorld: World;
	/** Seconds left to look at how the run ended before the result screen comes up. */
	private endDelay = 0;

	constructor(private readonly random: Random) {
		this.currentWorld = freshWorld(random);
	}

	get phase(): Phase {
		return this.currentPhase;
	}

	get world(): World {
		return this.currentWorld;
	}

	/** Starts a run from the title screen, or a new one from game over. */
	start(): void {
		if (this.currentPhase !== 'title' && this.currentPhase !== 'gameOver') return;
		this.currentWorld = freshWorld(this.random);
		this.currentPhase = 'playing';
	}

	togglePause(): void {
		if (this.currentPhase === 'playing') this.currentPhase = 'paused';
		else if (this.currentPhase === 'paused') this.currentPhase = 'playing';
	}

	pause(): void {
		if (this.currentPhase === 'playing') this.currentPhase = 'paused';
	}

	update(directions: readonly Vec2[], dt: number): void {
		if (this.currentPhase !== 'playing') return;
		if (this.currentWorld.over) {
			this.waitThenShowResult(dt);
			return;
		}
		step(this.currentWorld, directions, dt, this.random);
		if (this.currentWorld.over) this.endDelay = config.gameOverDelaySeconds;
	}

	/** The world stands still for a moment once a player is caught, so everyone sees why. */
	private waitThenShowResult(dt: number): void {
		this.endDelay -= dt;
		if (this.endDelay <= 0) this.currentPhase = 'gameOver';
	}
}

/**
 * A new world with a fresh random pillar layout and its lasers already in place, so the
 * title screen shows the triangle.
 */
function freshWorld(random: Random): World {
	const world = createWorld(generateObstacles(random));
	world.lasers = buildLasers(world.players, world.obstacles);
	return world;
}
