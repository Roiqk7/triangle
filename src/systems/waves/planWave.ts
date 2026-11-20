import { config, type EnemyKind, type WavePlan } from '../../config';
import { ENTRANCES } from '../../world/Wave';

/**
 * What wave `number` (starting at 1) contains. The first waves are written out by hand;
 * after those, each wave is the last one plus a bit more of everything.
 */
export function planWave(number: number): WavePlan {
	const { scripted, endless } = config.waves;
	if (number <= scripted.length) return scripted[number - 1];

	const extra = number - scripted.length - 1;
	const count = (kind: EnemyKind) =>
		Math.floor(endless.first[kind] + endless.perWave[kind] * extra);

	return {
		enemies: {
			chaser: count('chaser'),
			dasher: count('dasher'),
			brute: count('brute'),
		},
		entrances: ENTRANCES.length,
		spawnEvery: Math.max(
			endless.minSpawnEvery,
			endless.spawnEvery - endless.spawnEveryDrop * extra,
		),
		trains: endless.trains + (extra >= endless.secondTrainAfter ? 1 : 0),
		powerup: true,
	};
}

/** Everyone in the plan as a flat list, one entry per enemy. */
export function enemiesOf(plan: WavePlan): EnemyKind[] {
	const kinds = Object.keys(plan.enemies) as EnemyKind[];
	return kinds.flatMap((kind) => Array<EnemyKind>(plan.enemies[kind] ?? 0).fill(kind));
}
