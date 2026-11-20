import { config } from '../config';
import type { Random } from '../math/random';
import type { Vec2 } from '../math/vec2';
import type { Train } from '../world/Train';
import type { World } from '../world/World';

/** Starts a train event on a random track in a random direction: the warning comes first. */
export function announceTrain(world: World, random: Random): void {
	const tracks = config.train.trackXs;
	const direction = random() < 0.5 ? 1 : -1;
	world.train = {
		trackX: tracks[Math.floor(random() * tracks.length)],
		direction,
		warningLeft: config.train.warningSeconds,
		head: direction === 1 ? 0 : config.arena.height,
	};
}

/**
 * Counts down the warning, then drives the train along its track. Anyone under it is hit:
 * enemies are removed like any other washed-away enemy, a player ends the run.
 */
export function updateTrain(world: World, dt: number): void {
	const train = world.train;
	if (!train) return;
	if (train.warningLeft > 0) {
		train.warningLeft -= dt;
		return;
	}

	train.head += train.direction * config.train.speed * dt;
	for (const enemy of world.enemies) {
		if (isUnderTrain(train, enemy.position, enemy.radius)) enemy.hp = 0;
	}
	const hit = world.players.find((player) =>
		isUnderTrain(train, player.position, player.radius),
	);
	if (hit) {
		world.over = true;
		world.caught = hit.id;
	}
	if (hasLeft(train)) world.train = null;
}

/** The stretch of track the train covers right now, from its top end to its bottom end. */
export function trainSpan(train: Train): { top: number; bottom: number } {
	const tail = train.head - train.direction * config.train.length;
	return { top: Math.min(train.head, tail), bottom: Math.max(train.head, tail) };
}

export function isUnderTrain(train: Train, position: Vec2, radius: number): boolean {
	if (train.warningLeft > 0) return false;
	const { top, bottom } = trainSpan(train);
	const besideTrack = Math.abs(position.x - train.trackX) - radius;
	return (
		besideTrack < config.train.laneHalfWidth &&
		position.y + radius > top &&
		position.y - radius < bottom
	);
}

function hasLeft(train: Train): boolean {
	const { top, bottom } = trainSpan(train);
	return top > config.arena.height || bottom < 0;
}
