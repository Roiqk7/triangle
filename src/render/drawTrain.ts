import { config } from '../config';
import type { Train } from '../world/Train';
import { palette } from './palette';
import { box, disc } from './shapes';

const HEIGHT = config.arena.height;
const { laneHalfWidth, warningSeconds } = config.train;

const CARS = 3;
const CAR_GAP = 20;
const CAR_LENGTH = (config.train.length - CAR_GAP * (CARS - 1)) / CARS;
const CAR_WIDTH = (laneHalfWidth - 6) * 2;
const BODY_COLOR = '#1d4f9e';
const ROOF_COLOR = '#cbd5e1';
const VENT_COLOR = '#94a3b8';
const STRIPE_COLOR = '#facc15';
const GLASS_COLOR = '#0f172a';
const LAMP_COLOR = '#fef08a';
const CHEVRON_SPACING = 110;
const CHEVRON_SPEED = 320;

/** While a train is announced, its track flashes red with arrows running the way it will come. */
export function drawTrainWarning(
	ctx: CanvasRenderingContext2D,
	train: Train | null,
	clock: number,
) {
	if (!train || train.warningLeft <= 0) return;
	const urgency = 1 - train.warningLeft / warningSeconds;
	const blink = 0.5 + 0.5 * Math.sin(clock * (8 + urgency * 16));

	ctx.save();
	ctx.fillStyle = `rgba(220, 38, 38, ${0.12 + 0.26 * blink})`;
	ctx.fillRect(train.trackX - laneHalfWidth, 0, laneHalfWidth * 2, HEIGHT);

	ctx.strokeStyle = `rgba(254, 242, 242, ${0.5 + 0.4 * blink})`;
	ctx.lineWidth = 9;
	ctx.lineJoin = 'round';
	const travelled = (clock * CHEVRON_SPEED) % CHEVRON_SPACING;
	for (let at = -CHEVRON_SPACING; at < HEIGHT + CHEVRON_SPACING; at += CHEVRON_SPACING) {
		const y = train.direction === 1 ? at + travelled : HEIGHT - at - travelled;
		ctx.beginPath();
		ctx.moveTo(train.trackX - 26, y - 20 * train.direction);
		ctx.lineTo(train.trackX, y);
		ctx.lineTo(train.trackX + 26, y - 20 * train.direction);
		ctx.stroke();
	}
	ctx.restore();
}

/** The train itself, seen from above: three blue cars with the engine in front. */
export function drawTrain(ctx: CanvasRenderingContext2D, train: Train | null): void {
	if (!train || train.warningLeft > 0) return;

	ctx.save();
	ctx.translate(train.trackX, train.head);
	// In this space the train points up the screen, with its nose at the origin.
	if (train.direction === 1) ctx.rotate(Math.PI);
	ctx.strokeStyle = palette.outline;
	ctx.lineWidth = 3;
	for (let car = CARS - 1; car >= 0; car--) {
		drawCar(ctx, car * (CAR_LENGTH + CAR_GAP), car === 0);
	}
	ctx.restore();
}

function drawCar(ctx: CanvasRenderingContext2D, top: number, isEngine: boolean): void {
	const left = -CAR_WIDTH / 2;
	box(ctx, left + 8, top + 10, CAR_WIDTH, CAR_LENGTH, 16, palette.shadow, false);
	box(ctx, left, top, CAR_WIDTH, CAR_LENGTH, isEngine ? 26 : 14, BODY_COLOR);
	box(ctx, left + 5, top + 14, 6, CAR_LENGTH - 28, 3, STRIPE_COLOR, false);
	box(ctx, -left - 11, top + 14, 6, CAR_LENGTH - 28, 3, STRIPE_COLOR, false);
	box(
		ctx,
		left + 16,
		top + (isEngine ? 46 : 16),
		CAR_WIDTH - 32,
		CAR_LENGTH - (isEngine ? 62 : 32),
		8,
		ROOF_COLOR,
	);
	box(ctx, -14, top + CAR_LENGTH * 0.4, 28, 16, 3, VENT_COLOR);
	box(ctx, -14, top + CAR_LENGTH * 0.7, 28, 16, 3, VENT_COLOR);

	if (!isEngine) return;
	box(ctx, left + 12, top + 14, CAR_WIDTH - 24, 22, 8, GLASS_COLOR);
	disc(ctx, left + 14, top + 7, 5, LAMP_COLOR);
	disc(ctx, -left - 14, top + 7, 5, LAMP_COLOR);
}
