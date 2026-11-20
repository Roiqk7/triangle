/** A train event: first a warning on one track, then the train sweeping along it. */
export interface Train {
	/** Horizontal position of the track it runs on. */
	readonly trackX: number;
	/** 1 runs top to bottom, -1 bottom to top. */
	readonly direction: 1 | -1;
	/** Seconds of warning still to go. The train only moves once this reaches zero. */
	warningLeft: number;
	/** Vertical position of the front of the train. */
	head: number;
}
