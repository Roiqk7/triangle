/** Longest frame we simulate, so a stalled tab does not cause a burst of catch-up steps. */
const MAX_FRAME_SECONDS = 0.25;
const FPS_SMOOTHING = 0.9;

/**
 * Runs `update` at a fixed rate and `render` once per browser frame, so the game
 * behaves the same on any monitor.
 */
export class GameLoop {
	private accumulated = 0;
	private lastTime: number | null = null;
	private smoothedFps = 0;

	constructor(
		private readonly stepSeconds: number,
		private readonly update: (dt: number) => void,
		private readonly render: () => void,
	) {}

	get fps(): number {
		return this.smoothedFps;
	}

	start(): void {
		requestAnimationFrame(this.frame);
	}

	private readonly frame = (now: number): void => {
		const elapsed = this.lastTime === null ? 0 : (now - this.lastTime) / 1000;
		this.lastTime = now;
		this.trackFps(elapsed);

		this.accumulated += Math.min(elapsed, MAX_FRAME_SECONDS);
		while (this.accumulated >= this.stepSeconds) {
			this.update(this.stepSeconds);
			this.accumulated -= this.stepSeconds;
		}
		this.render();
		requestAnimationFrame(this.frame);
	};

	private trackFps(elapsed: number): void {
		if (elapsed <= 0) return;
		const current = 1 / elapsed;
		this.smoothedFps =
			this.smoothedFps === 0
				? current
				: this.smoothedFps * FPS_SMOOTHING + current * (1 - FPS_SMOOTHING);
	}
}
