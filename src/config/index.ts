import { dash, enemies, enemyTurnSpeed } from './enemies';
import { keys } from './keys';
import { powerups } from './powerups';
import { waves } from './waves';

export type { BehaviorKind, DashSettings, EnemyKind, EnemyStats } from './enemies';
export type { PlayerKeys } from './keys';
export type { EffectKind, PowerupKind } from './powerups';
export type { WavePlan } from './waves';

/** Every tunable number in the game. Bigger groups live in their own file next to this one. */
export const config = {
	stepsPerSecond: 60,
	arena: { width: 1600, height: 900 },
	player: {
		radius: 14,
		speed: 260,
		/** Units per second gained (or lost) each second: full speed in a tenth of a second. */
		acceleration: 2600,
		/** Radians per second a player can turn. Only affects how it is drawn. */
		turnSpeed: 16,
		startTriangleSide: 300,
	},
	laser: {
		maxLength: 520,
		halfWidth: 3,
		damagePerSecond: 120,
		/** Fraction of the max length at which a laser starts to show strain. */
		strainFrom: 0.7,
		/** How long a laser survives beyond its max length before it snaps. */
		snapSeconds: 1,
		/** Beyond this many times the max length it snaps at once. */
		snapLengthFactor: 1.4,
		/** Seconds of overstretch forgotten per second spent back within range. */
		recoverRate: 2,
	},
	/** Round pillars placed at random each run. They block lasers, players and enemies. */
	obstacles: {
		count: 7,
		minRadius: 28,
		maxRadius: 64,
		/** Free space between a pillar and the arena edge. */
		edgeMargin: 70,
		/** Distance from the arena centre kept free, so the start triangle is never blocked. */
		clearCenterRadius: 240,
		/** Free space between two pillars; wide enough for the largest enemy. */
		minGap: 90,
		/** Free space between a pillar and the edge of a train track. */
		trackMargin: 12,
		maxAttempts: 400,
	},
	/** Trains run top to bottom or bottom to top along fixed tracks. */
	train: {
		trackXs: [480, 1120],
		/** Half the width of the strip a train sweeps. */
		laneHalfWidth: 46,
		/** How long the track flashes before the train arrives. */
		warningSeconds: 2.5,
		speed: 1500,
		length: 760,
	},
	spawn: {
		/** How far outside the arena enemies appear. */
		margin: 40,
	},
	/** How long the burst left behind by a washed-away enemy stays on screen. */
	splash: { seconds: 0.6 },
	/** Pause between a janitor being caught and the result screen, to see what happened. */
	gameOverDelaySeconds: 1.4,
	enemyTurnSpeed,
	enemies,
	dash,
	waves,
	powerups,
	keys,
} as const;
