import { config } from '../../config';
import { drawEntrances } from './drawEntrances';
import { drawLightShafts, drawVignette } from './drawLighting';
import { drawMosaic } from './drawMosaic';
import { drawTactileStrips } from './drawTactileStrips';
import { drawGrime, drawTiles } from './drawTiles';
import { drawTracks } from './drawTracks';

/** Pixels per arena unit in the stored picture; enough to stay sharp on large screens. */
const DETAIL = 2;

/**
 * Paints everything in the hall that never changes (tiles, mosaic, tracks, signs, light)
 * once into a picture, so each frame only has to copy it.
 */
export function createStationFloor(): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = config.arena.width * DETAIL;
	canvas.height = config.arena.height * DETAIL;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Cannot draw the station floor');
	ctx.scale(DETAIL, DETAIL);

	drawTiles(ctx);
	drawMosaic(ctx);
	drawTactileStrips(ctx);
	drawTracks(ctx);
	drawGrime(ctx);
	drawEntrances(ctx);
	drawLightShafts(ctx);
	drawVignette(ctx);
	return canvas;
}
