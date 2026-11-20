import { config, type EffectKind } from '../config';
import type { World } from '../world/World';

/**
 * The numbers that power-ups change. Every rule that uses one of these asks here instead of
 * reading the config, so a power-up effect lives in exactly one place.
 */
export function isRunning(world: World, effect: EffectKind): boolean {
	return world.effects[effect] > 0;
}

export function playerSpeed(world: World): number {
	const boost = isRunning(world, 'coffee') ? config.powerups.coffeeSpeedFactor : 1;
	return config.player.speed * boost;
}

export function laserMaxLength(world: World): number {
	const boost = isRunning(world, 'longHose') ? config.powerups.longHoseLengthFactor : 1;
	return config.laser.maxLength * boost;
}

export function laserHalfWidth(world: World): number {
	const boost = isRunning(world, 'pressure') ? config.powerups.pressureWidthFactor : 1;
	return config.laser.halfWidth * boost;
}

export function laserDamagePerSecond(world: World): number {
	const boost = isRunning(world, 'pressure') ? config.powerups.pressureDamageFactor : 1;
	return config.laser.damagePerSecond * boost;
}

/** Multiplies how fast enemies move. */
export function enemySpeedFactor(world: World): number {
	return isRunning(world, 'wetFloor') ? config.powerups.wetFloorSpeedFactor : 1;
}
