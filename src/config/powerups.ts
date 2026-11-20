/** Power-ups whose effect lasts for a while. */
export type EffectKind = 'coffee' | 'longHose' | 'pressure' | 'wetFloor';
/** Everything that can lie on the floor. The last two act once, at the moment of pick-up. */
export type PowerupKind = EffectKind | 'shield' | 'foamBomb';

const kinds: readonly PowerupKind[] = [
	'coffee',
	'longHose',
	'pressure',
	'wetFloor',
	'shield',
	'foamBomb',
];

const effectSeconds: Record<EffectKind, number> = {
	coffee: 10,
	longHose: 12,
	pressure: 10,
	wetFloor: 8,
};

export const powerups = {
	kinds,
	radius: 20,
	/** How long a power-up waits on the floor before it disappears. */
	lifeSeconds: 14,
	/** Chance that someone washed away leaves a power-up behind. */
	dropChance: 0.06,
	maxOnFloor: 3,
	/** Power-ups stay out of the game until this wave, so wave 1 has nothing extra to learn. */
	firstWave: 2,
	effectSeconds,

	/** Coffee: the whole crew walks faster. */
	coffeeSpeedFactor: 1.4,
	/** Long hose: streams reach further before they strain. */
	longHoseLengthFactor: 1.5,
	/** Pressure washer: streams are wider and soak faster. */
	pressureWidthFactor: 4,
	pressureDamageFactor: 3,
	/** Wet floor: everyone but the crew walks slower. */
	wetFloorSpeedFactor: 0.5,
	/** Bubble shield: the crew survives this many touches; whoever touches is washed away. */
	maxShields: 2,
	/** Foam bomb: soaks everyone this close to the janitor who picked it up. */
	foamBombRadius: 260,
	foamBombDamage: 200,
};
