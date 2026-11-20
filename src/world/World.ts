import { config, type EffectKind } from '../config';
import { ZERO } from '../math/vec2';
import type { Enemy } from './Enemy';
import type { Laser } from './Laser';
import type { Obstacle } from './Obstacle';
import type { Player } from './Player';
import type { Powerup } from './Powerup';
import type { Splash } from './Splash';
import type { Train } from './Train';
import type { Wave } from './Wave';

export interface World {
	readonly players: Player[];
	readonly obstacles: readonly Obstacle[];
	enemies: Enemy[];
	lasers: Laser[];
	splashes: Splash[];
	/** Power-ups lying on the floor. */
	powerups: Powerup[];
	/** Seconds left of each timed power-up effect; zero when it is not running. */
	readonly effects: Record<EffectKind, number>;
	/** Touches the crew can still survive thanks to shield power-ups. */
	shields: number;
	readonly wave: Wave;
	/** The train event in progress, if any. */
	train: Train | null;
	/** Seconds played. */
	time: number;
	kills: number;
	/** Set when a player is caught by an enemy or a train. */
	over: boolean;
	/** Id of the player who was caught. */
	caught: number | null;
}

/** Angles of the three start corners: P1 bottom-left, P2 top, P3 bottom-right. */
const START_ANGLES = [(5 * Math.PI) / 6, -Math.PI / 2, Math.PI / 6];

export function createWorld(obstacles: readonly Obstacle[] = []): World {
	return {
		players: createPlayers(),
		obstacles,
		enemies: [],
		lasers: [],
		splashes: [],
		powerups: [],
		effects: { coffee: 0, longHose: 0, pressure: 0, wetFloor: 0 },
		shields: 0,
		wave: createFirstBreak(),
		train: null,
		time: 0,
		kills: 0,
		over: false,
		caught: null,
	};
}

function createPlayers(): Player[] {
	const { width, height } = config.arena;
	const centerToCorner = config.player.startTriangleSide / Math.sqrt(3);

	return START_ANGLES.map((angle, id) => ({
		id,
		radius: config.player.radius,
		velocity: ZERO,
		facing: angle,
		walked: 0,
		position: {
			x: width / 2 + Math.cos(angle) * centerToCorner,
			y: height / 2 + Math.sin(angle) * centerToCorner,
		},
	}));
}

/** Every run opens with a short quiet moment before wave 1. */
function createFirstBreak(): Wave {
	return {
		number: 1,
		phase: 'break',
		breakLeft: config.waves.firstBreakSeconds,
		queue: [],
		spawnIn: 0,
		spawnEvery: 0,
		entrances: [],
		trainsIn: [],
	};
}
