import type { Random } from '../math/random';
import type { World } from '../world/World';
import { maybeDropPowerup } from './powerups/placePowerups';

/**
 * Removes every enemy with no health left, whatever took it: a laser, a train, a shield or
 * a foam bomb. Counts them, leaves a splash where each stood, and sometimes a power-up.
 */
export function removeWashedEnemies(world: World, random: Random): void {
	const washed = world.enemies.filter((enemy) => enemy.hp <= 0);
	if (washed.length === 0) return;

	world.enemies = world.enemies.filter((enemy) => enemy.hp > 0);
	world.kills += washed.length;
	for (const { position, radius } of washed) {
		world.splashes.push({ position, radius, startedAt: world.time });
		maybeDropPowerup(world, position, random);
	}
}
