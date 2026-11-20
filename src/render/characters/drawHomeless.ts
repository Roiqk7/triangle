import { palette } from '../palette';
import { box, disc, line, oval } from '../shapes';
import { drawFeet, drawHands, stride, withPose, type Pose } from './sprite';

const SHOE_COLOR = '#44403c';
const COAT_COLOR = '#7a5c3e';
const PATCH_COLOR = '#b08d5f';
const BAG_COLOR = '#e7e5e4';
const BAG_STRIPE_COLOR = '#2563eb';
const BEARD_COLOR = '#8f8a85';
const BEANIE_COLOR = '#9f1239';
const POMPOM_COLOR = '#fda4af';

/**
 * A homeless man seen from above: long patched coat, beanie with a pompom, grey beard, and a
 * striped plastic bag swinging from one hand.
 */
export function drawHomeless(ctx: CanvasRenderingContext2D, pose: Pose): void {
	withPose(ctx, pose, () => {
		const swing = stride(pose);
		drawFeet(ctx, swing, SHOE_COLOR);

		const bagX = swing * 3.5 + 1.5;
		disc(ctx, bagX, 13.4, 3.9, BAG_COLOR);
		line(ctx, bagX - 2.4, 13.4, bagX + 2.4, 13.4, BAG_STRIPE_COLOR, 1.2);

		oval(ctx, -0.6, 0, 7.3, 10.2, COAT_COLOR);
		box(ctx, -4.6, 2.6, 3.6, 3.6, 0.7, PATCH_COLOR);
		drawHands(ctx, swing, palette.skin, 10);

		disc(ctx, 5.9, 0, 3.3, BEARD_COLOR);
		disc(ctx, 2.6, 0, 4.8, palette.skin);
		disc(ctx, 0.9, 0, 5.1, BEANIE_COLOR);
		disc(ctx, 0.9, 0, 1.7, POMPOM_COLOR);
	});
}
