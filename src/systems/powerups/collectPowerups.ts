import { config } from '../../config';
import { circlesOverlap } from '../../math/geometry';
import type { Powerup } from '../../world/Powerup';
import type { World } from '../../world/World';
import { applyPowerup } from './applyPowerup';

/** A player walking over a power-up picks it up for the whole crew. */
export function collectPowerups(world: World): void {
	const left: Powerup[] = [];
	for (const powerup of world.powerups) {
		const picker = world.players.find((player) =>
			circlesOverlap(
				player.position,
				player.radius,
				powerup.position,
				config.powerups.radius,
			),
		);
		if (picker) applyPowerup(world, powerup.kind, picker);
		else left.push(powerup);
	}
	world.powerups = left;
}
