export type EnemyKind = 'chaser' | 'dasher' | 'brute';
export type BehaviorKind = 'seek' | 'dash';

export interface EnemyStats {
	readonly radius: number;
	readonly hp: number;
	readonly speed: number;
	readonly behavior: BehaviorKind;
}

export interface DashSettings {
	readonly triggerDistance: number;
	readonly windUpSeconds: number;
	readonly dashSeconds: number;
	readonly dashSpeed: number;
}

export const enemies: Record<EnemyKind, EnemyStats> = {
	chaser: { radius: 12, hp: 1, speed: 90, behavior: 'seek' },
	dasher: { radius: 12, hp: 1, speed: 120, behavior: 'dash' },
	brute: { radius: 26, hp: 150, speed: 50, behavior: 'seek' },
};

export const dash: DashSettings = {
	triggerDistance: 300,
	windUpSeconds: 0.7,
	dashSeconds: 0.45,
	dashSpeed: 750,
};

/** Radians per second an enemy can turn. Only affects how it is drawn. */
export const enemyTurnSpeed = 10;
