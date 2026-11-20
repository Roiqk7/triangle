import type { PowerupKind } from '../../config';
import { palette } from '../palette';
import { box, disc, polygon } from '../shapes';

type IconDrawer = (ctx: CanvasRenderingContext2D) => void;

/** The colour that stands for each power-up: its ring on the floor and its bar in the HUD. */
export const powerupColors: Record<PowerupKind, string> = {
	coffee: '#92400e',
	longHose: '#16a34a',
	pressure: '#dc2626',
	wetFloor: '#f59e0b',
	shield: '#38bdf8',
	foamBomb: '#0d9488',
};

/** Pictograms, each drawn around the origin to fit a circle of radius 10. */
const icons: Record<PowerupKind, IconDrawer> = {
	/** A cup of coffee from above, with its handle. */
	coffee: (ctx) => {
		disc(ctx, 7.5, 0, 3.2, '#f5f5f4');
		disc(ctx, -1, 0, 7.5, '#f5f5f4');
		disc(ctx, -1, 0, 5.2, '#7c2d12');
	},
	/** A coiled hose with its nozzle sticking out. */
	longHose: (ctx) => {
		box(ctx, 3, -9.5, 7, 4, 1.5, '#facc15');
		disc(ctx, 0, 1, 8, '#16a34a');
		disc(ctx, 0, 1, 5, '#bbf7d0');
		disc(ctx, 0, 1, 2.4, '#16a34a');
	},
	/** A lightning bolt: more power. */
	pressure: (ctx) => {
		polygon(ctx, [2, -10, -6, 1.5, -0.5, 1.5, -2.5, 10, 6.5, -2.5, 1, -2.5], '#facc15');
	},
	/** The yellow "wet floor" sign. */
	wetFloor: (ctx) => {
		polygon(ctx, [0, -9.5, 9.5, 8, -9.5, 8], '#facc15');
		box(ctx, -1.2, -4, 2.4, 6.5, 1, palette.outline, false);
		disc(ctx, 0, 5, 1.4, palette.outline, false);
	},
	/** A soap bubble with a shine on it. */
	shield: (ctx) => {
		disc(ctx, 0, 0, 8.5, '#bae6fd');
		disc(ctx, -3, -3, 2.4, '#ffffff', false);
	},
	/** A heap of foam bubbles. */
	foamBomb: (ctx) => {
		disc(ctx, -4, 3, 5, palette.foam);
		disc(ctx, 4.5, 3.5, 4.2, palette.sanitizerLight);
		disc(ctx, 0.5, -4, 5.4, palette.foam);
	},
};

/** Draws the pictogram for `kind` centred on (x, y), `size` times its design size. */
export function drawPowerupIcon(
	ctx: CanvasRenderingContext2D,
	kind: PowerupKind,
	x: number,
	y: number,
	size: number,
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(size, size);
	ctx.strokeStyle = palette.outline;
	ctx.lineWidth = 1.2;
	ctx.lineJoin = 'round';
	icons[kind](ctx);
	ctx.restore();
}
