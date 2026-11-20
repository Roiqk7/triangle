import { config } from '../config';
import { segmentCrossesCircle } from '../math/geometry';
import { distance, type Vec2 } from '../math/vec2';
import type { Laser } from '../world/Laser';
import type { Obstacle } from '../world/Obstacle';
import type { Player } from '../world/Player';

/**
 * One laser between each pair of players. `previous` is the result of the last call (same
 * order), so that each laser remembers how long it has been overstretched; `dt` is the time
 * since then.
 */
export function buildLasers(
	players: readonly Player[],
	obstacles: readonly Obstacle[],
	maxLength: number = config.laser.maxLength,
	previous: readonly Laser[] = [],
	dt = 0,
): Laser[] {
	const lasers: Laser[] = [];
	for (let i = 0; i < players.length; i++) {
		for (let j = i + 1; j < players.length; j++) {
			const from = players[i].position;
			const to = players[j].position;
			const blocked = isBlocked(from, to, obstacles);
			const state = tension(
				distance(from, to) / maxLength,
				previous[lasers.length],
				dt,
			);
			lasers.push({
				from,
				to,
				blocked,
				...state,
				active: !blocked && !state.snapped,
			});
		}
	}
	return lasers;
}

/**
 * A laser does not switch off the moment it is too long. Overstretch builds up while it is
 * beyond its max length and drains again once it is back in range. It snaps when the
 * build-up reaches the snap time, or at once if stretched absurdly far, and stays snapped
 * until the players are back within range.
 */
function tension(strain: number, before: Laser | undefined, dt: number) {
	const { snapSeconds, snapLengthFactor, recoverRate } = config.laser;
	const built = before?.overstretch ?? 0;
	const overstretch =
		strain > 1
			? Math.min(snapSeconds, built + dt)
			: Math.max(0, built - recoverRate * dt);

	const justSnapped = overstretch >= snapSeconds || strain > snapLengthFactor;
	const snapped = strain > 1 && (justSnapped || (before?.snapped ?? false));
	return { strain, overstretch, snapped };
}

function isBlocked(from: Vec2, to: Vec2, obstacles: readonly Obstacle[]): boolean {
	return obstacles.some((obstacle) =>
		segmentCrossesCircle(from, to, obstacle.position, obstacle.radius),
	);
}
