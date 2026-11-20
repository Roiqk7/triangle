import { palette } from './palette';

/** Fits the fixed-size arena into the window, centred, keeping its proportions. */
export class Viewport {
	private scale = 1;
	private offsetX = 0;
	private offsetY = 0;

	constructor(
		private readonly canvas: HTMLCanvasElement,
		private readonly arenaWidth: number,
		private readonly arenaHeight: number,
	) {
		window.addEventListener('resize', () => this.fit());
		this.fit();
	}

	/** Clears the canvas and sets it up so drawing can use arena units. */
	begin(ctx: CanvasRenderingContext2D): void {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = palette.backdrop;
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
	}

	private fit(): void {
		const pixelRatio = window.devicePixelRatio || 1;
		this.canvas.width = Math.round(window.innerWidth * pixelRatio);
		this.canvas.height = Math.round(window.innerHeight * pixelRatio);
		this.canvas.style.width = `${window.innerWidth}px`;
		this.canvas.style.height = `${window.innerHeight}px`;

		this.scale = Math.min(
			this.canvas.width / this.arenaWidth,
			this.canvas.height / this.arenaHeight,
		);
		this.offsetX = (this.canvas.width - this.arenaWidth * this.scale) / 2;
		this.offsetY = (this.canvas.height - this.arenaHeight * this.scale) / 2;
	}
}
