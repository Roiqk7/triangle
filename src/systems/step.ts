import type { Random } from '../math/random';
import type { Vec2 } from '../math/vec2';
import type { World } from '../world/World';
import { checkContacts } from './checkContacts';
import { movePlayers } from './movePlayers';
import { collectPowerups } from './powerups/collectPowerups';
import { removeWashedEnemies } from './removeWashedEnemies';
import { forgetOldThings, tickEffects } from './tidyUp';
import { updateEnemies } from './updateEnemies';
import { updateLasers } from './updateLasers';
import { updateTrain } from './updateTrain';
import { runWaves } from './waves/runWaves';

/**
 * Advances the world by one step. The order is part of the rules: everything that can take
 * an enemy out (power-ups, lasers, trains) runs before contacts are checked, so an enemy
 * that is hit and touches a player in the same step is out first and the crew lives.
 */
export function step(world: World, directions: readonly Vec2[], dt: number, random: Random): void {
	world.time += dt;
	tickEffects(world, dt);
	movePlayers(world, directions, dt);
	updateEnemies(world, dt);
	collectPowerups(world);
	updateLasers(world, dt);
	updateTrain(world, dt);
	checkContacts(world);
	removeWashedEnemies(world, random);
	runWaves(world, dt, random);
	forgetOldThings(world);
}
