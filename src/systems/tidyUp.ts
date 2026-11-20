import { config } from '../config';
import type { World } from '../world/World';

/** Counts down the timed power-up effects. */
export function tickEffects(world: World, dt: number): void {
	for (const effect of Object.keys(world.effects) as (keyof World['effects'])[]) {
		world.effects[effect] = Math.max(0, world.effects[effect] - dt);
	}
}

/** Forgets splashes that have finished playing and power-ups nobody came for. */
export function forgetOldThings(world: World): void {
	world.splashes = world.splashes.filter(
		(splash) => world.time - splash.startedAt < config.splash.seconds,
	);
	world.powerups = world.powerups.filter(
		(powerup) => world.time - powerup.spawnedAt < config.powerups.lifeSeconds,
	);
}
