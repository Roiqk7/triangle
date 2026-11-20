import { circlesOverlap } from '../math/geometry';
import type { Enemy } from '../world/Enemy';
import type { Player } from '../world/Player';
import type { World } from '../world/World';

/**
 * An enemy touching a player ends the run, unless the crew has a shield left: then the
 * shield is used up and the enemy is washed away instead. Enemies already out of health
 * are ignored, so a laser hit in the same step always wins.
 */
export function checkContacts(world: World): void {
	for (const enemy of world.enemies) {
		if (enemy.hp <= 0) continue;
		const touched = world.players.find((player) => touching(enemy, player));
		if (!touched) continue;

		if (world.shields > 0) {
			world.shields -= 1;
			enemy.hp = 0;
			continue;
		}
		world.over = true;
		world.caught = touched.id;
		return;
	}
}

function touching(enemy: Enemy, player: Player): boolean {
	return circlesOverlap(enemy.position, enemy.radius, player.position, player.radius);
}
