import { disc, oval } from '../shapes';
import { drawFeet, drawHands, stride, withPose, type Pose } from './sprite';

const SHOE_COLOR = '#27272a';
const HOODIE_COLOR = '#5b21b6';
const HOOD_COLOR = '#7c3aed';
const FACE_COLOR = '#d9e8b8';
const EYE_COLOR = '#dc2626';
const SHAKE = 1.6;

/**
 * A drug addict seen from above: skinny, hood up, pale face, red eyes. While `tense` (about
 * to sprint) he shakes on the spot with both hands out in front.
 */
export function drawAddict(
	ctx: CanvasRenderingContext2D,
	pose: Pose,
	tense: boolean,
	clock: number,
): void {
	withPose(ctx, tense ? shaken(pose, clock) : pose, () => {
		const swing = stride(pose);
		drawFeet(ctx, swing, SHOE_COLOR);
		oval(ctx, 0, 0, 5.6, 8.6, HOODIE_COLOR);

		if (tense) {
			disc(ctx, 6.5, -4.6, 2.4, FACE_COLOR);
			disc(ctx, 6.5, 4.6, 2.4, FACE_COLOR);
		} else {
			drawHands(ctx, swing, FACE_COLOR, 8.4);
		}

		disc(ctx, 1.2, 0, 5.4, HOOD_COLOR);
		disc(ctx, 3.5, 0, 3.3, FACE_COLOR);
		disc(ctx, 5, -1.4, 0.8, EYE_COLOR, false);
		disc(ctx, 5, 1.4, 0.8, EYE_COLOR, false);
	});
}

/** The same pose, nudged a different way every moment. */
function shaken(pose: Pose, clock: number): Pose {
	return {
		...pose,
		position: {
			x: pose.position.x + Math.sin(clock * 95) * SHAKE,
			y: pose.position.y + Math.cos(clock * 71) * SHAKE,
		},
	};
}
