import { distance, type Vec2 } from '../math/vec2';
import type { Player } from '../world/Player';

export function nearestPlayer(from: Vec2, players: readonly Player[]): Player {
	return players.reduce((nearest, player) =>
		distance(from, player.position) < distance(from, nearest.position)
			? player
			: nearest,
	);
}
