import type { EnemyKind } from './enemies';

export interface WavePlan {
	/** How many of each kind walk in during the wave. */
	readonly enemies: Readonly<Partial<Record<EnemyKind, number>>>;
	/** How many of the four entrances they come through. Fewer is easier to face. */
	readonly entrances: number;
	/** Seconds between two arrivals. */
	readonly spawnEvery: number;
	/** How many trains cross the hall during the wave. */
	readonly trains: number;
	/** Whether a power-up is put on the floor when the wave starts. */
	readonly powerup: boolean;
}

/**
 * The opening waves, written by hand so that each one adds a single new thing to learn:
 * 1 homeless and streams, 2 power-ups, 3 addicts, 4 trains, 5 cops.
 */
const scripted: readonly WavePlan[] = [
	{ enemies: { chaser: 4 }, entrances: 1, spawnEvery: 1.8, trains: 0, powerup: false },
	{ enemies: { chaser: 7 }, entrances: 1, spawnEvery: 1.4, trains: 0, powerup: true },
	{
		enemies: { chaser: 6, dasher: 2 },
		entrances: 2,
		spawnEvery: 1.3,
		trains: 0,
		powerup: true,
	},
	{
		enemies: { chaser: 8, dasher: 3 },
		entrances: 2,
		spawnEvery: 1.2,
		trains: 1,
		powerup: true,
	},
	{
		enemies: { chaser: 8, dasher: 3, brute: 1 },
		entrances: 3,
		spawnEvery: 1.1,
		trains: 1,
		powerup: true,
	},
];

export const waves = {
	/** Quiet time before the first wave, to find your keys. */
	firstBreakSeconds: 4,
	/** Quiet time between two waves. */
	breakSeconds: 6,
	scripted,
	/** Every wave after the scripted ones starts from `first` and grows by `perWave`. */
	endless: {
		first: { chaser: 10, dasher: 3, brute: 1 },
		perWave: { chaser: 2, dasher: 1, brute: 0.5 },
		spawnEvery: 1,
		spawnEveryDrop: 0.06,
		minSpawnEvery: 0.4,
		trains: 1,
		/** One more train per wave from this many waves into the endless part. */
		secondTrainAfter: 4,
	},
};
