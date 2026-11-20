import { config } from '../config';
import { angleOf, turnTowards } from '../math/angles';
import { clamp } from '../math/geometry';
import { add, approach, length, scale, ZERO, type Vec2 } from '../math/vec2';
import type { Player } from '../world/Player';
import type { World } from '../world/World';
import { keepOutOfObstacles } from './keepOutOfObstacles';
import { playerSpeed } from './modifiers';

/**
 * Eases each player towards the speed its keys ask for, moves it around pillars and keeps
 * it inside the arena. Easing makes starts, stops and turns feel smooth instead of abrupt.
 */
export function movePlayers(world: World, directions: readonly Vec2[], dt: number): void {
	const speed = playerSpeed(world);

	for (const player of world.players) {
		const wanted = scale(directions[player.id] ?? ZERO, speed);
		player.velocity = approach(
			player.velocity,
			wanted,
			config.player.acceleration * dt,
		);
		if (length(player.velocity) === 0) continue;

		const next = add(player.position, scale(player.velocity, dt));
		player.position = insideArena(
			keepOutOfObstacles(next, player.radius, world.obstacles),
			player.radius,
		);
		turnAndStride(player, dt);
	}
}

function insideArena(position: Vec2, radius: number): Vec2 {
	return {
		x: clamp(position.x, radius, config.arena.width - radius),
		y: clamp(position.y, radius, config.arena.height - radius),
	};
}

/** Bookkeeping for drawing: where the player looks and how far it has walked. */
function turnAndStride(player: Player, dt: number): void {
	const maxTurn = config.player.turnSpeed * dt;
	player.facing = turnTowards(player.facing, angleOf(player.velocity), maxTurn);
	player.walked += length(player.velocity) * dt;
}
