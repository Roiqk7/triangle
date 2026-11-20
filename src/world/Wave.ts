import type { EnemyKind } from '../config';

/** A wall of the arena that enemies can walk in through. */
export type Entrance = 'top' | 'right' | 'bottom' | 'left';

export const ENTRANCES: readonly Entrance[] = ['top', 'right', 'bottom', 'left'];

/** Where the run is in its sequence of waves. */
export interface Wave {
	/** The wave being fought, or the one about to start during a break. Starts at 1. */
	number: number;
	/** 'break' is the quiet time before a wave; 'active' lasts until everyone is gone. */
	phase: 'break' | 'active';
	/** Seconds of break still to go. */
	breakLeft: number;
	/** Enemies of this wave that have not walked in yet. */
	queue: EnemyKind[];
	/** Seconds until the next one walks in, and the gap between two of them. */
	spawnIn: number;
	spawnEvery: number;
	/** The entrances this wave uses. */
	entrances: Entrance[];
	/** For each train still to come this wave: seconds until its warning starts. */
	trainsIn: number[];
}
