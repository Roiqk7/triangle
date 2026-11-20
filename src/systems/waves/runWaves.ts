import { config } from '../../config';
import { createEnemy } from '../../enemies/createEnemy';
import type { Random } from '../../math/random';
import { ENTRANCES, type Wave } from '../../world/Wave';
import type { World } from '../../world/World';
import { placePowerup } from '../powerups/placePowerups';
import { announceTrain } from '../updateTrain';
import { enemiesOf, planWave } from './planWave';
import { spawnPoint } from './spawnPoint';

/** Seconds into a wave before its first train may be announced. */
const TRAIN_LEAD_IN = 3;

/**
 * Runs the sequence of waves: a quiet break, then enemies walking in one by one, then the
 * next break as soon as the last of them is gone.
 */
export function runWaves(world: World, dt: number, random: Random): void {
	const wave = world.wave;
	if (wave.phase === 'break') {
		wave.breakLeft -= dt;
		if (wave.breakLeft <= 0) startWave(world, random);
		return;
	}

	letNextOneIn(world, dt, random);
	sendTrains(world, dt, random);
	if (wave.queue.length === 0 && world.enemies.length === 0) startBreak(wave);
}

function startWave(world: World, random: Random): void {
	const wave = world.wave;
	const plan = planWave(wave.number);
	const arrivalSeconds = enemiesOf(plan).length * plan.spawnEvery;

	wave.phase = 'active';
	wave.queue = shuffled(enemiesOf(plan), random);
	wave.spawnEvery = plan.spawnEvery;
	wave.spawnIn = 0;
	wave.entrances = shuffled(ENTRANCES, random).slice(0, plan.entrances);
	wave.trainsIn = Array.from(
		{ length: plan.trains },
		() => TRAIN_LEAD_IN + random() * arrivalSeconds,
	);
	if (plan.powerup) placePowerup(world, random);
}

function startBreak(wave: Wave): void {
	wave.number += 1;
	wave.phase = 'break';
	wave.breakLeft = config.waves.breakSeconds;
	wave.trainsIn = [];
}

function letNextOneIn(world: World, dt: number, random: Random): void {
	const wave = world.wave;
	wave.spawnIn -= dt;
	if (wave.spawnIn > 0) return;

	const kind = wave.queue.pop();
	if (!kind) return;
	const entrance = wave.entrances[Math.floor(random() * wave.entrances.length)];
	world.enemies.push(createEnemy(kind, spawnPoint(entrance, random)));
	wave.spawnIn = wave.spawnEvery;
}

/** Announces each of the wave's trains when its time comes, one train at a time. */
function sendTrains(world: World, dt: number, random: Random): void {
	const wave = world.wave;
	wave.trainsIn = wave.trainsIn.map((seconds) => seconds - dt);

	const due = wave.trainsIn.findIndex((seconds) => seconds <= 0);
	if (due === -1 || world.train) return;
	wave.trainsIn.splice(due, 1);
	announceTrain(world, random);
}

function shuffled<T>(items: readonly T[], random: Random): T[] {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}
