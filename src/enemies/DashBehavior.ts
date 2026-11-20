import type { DashSettings } from '../config';
import { directionTo, distance, scale, ZERO, type Vec2 } from '../math/vec2';
import type { Enemy } from '../world/Enemy';
import type { World } from '../world/World';
import type { EnemyBehavior } from './EnemyBehavior';
import { nearestPlayer } from './nearestPlayer';
import { steerAround } from './steerAround';

type Phase = 'approach' | 'windUp' | 'dash';

/** Walks close, stops and announces a direction, then dashes along it. Used by the Dasher. */
export class DashBehavior implements EnemyBehavior {
	private phase: Phase = 'approach';
	private timeLeft = 0;
	private direction: Vec2 = ZERO;

	constructor(private readonly settings: DashSettings) {}

	update(enemy: Enemy, world: World, dt: number): void {
		if (this.phase === 'approach') this.approach(enemy, world);
		else if (this.phase === 'windUp') this.windUp(enemy, dt);
		else this.dash(enemy, dt);
	}

	private approach(enemy: Enemy, world: World): void {
		const target = nearestPlayer(enemy.position, world.players);
		const direction = directionTo(enemy.position, target.position);

		if (distance(enemy.position, target.position) > this.settings.triggerDistance) {
			const heading = steerAround(
				enemy.position,
				enemy.radius,
				target.position,
				world.obstacles,
			);
			enemy.velocity = scale(heading, enemy.speed);
			return;
		}
		this.phase = 'windUp';
		this.timeLeft = this.settings.windUpSeconds;
		this.direction = direction;
		enemy.aim = direction;
		enemy.velocity = ZERO;
	}

	private windUp(enemy: Enemy, dt: number): void {
		enemy.velocity = ZERO;
		this.timeLeft -= dt;
		if (this.timeLeft > 0) return;

		this.phase = 'dash';
		this.timeLeft = this.settings.dashSeconds;
		enemy.aim = null;
	}

	private dash(enemy: Enemy, dt: number): void {
		enemy.velocity = scale(this.direction, this.settings.dashSpeed);
		this.timeLeft -= dt;
		if (this.timeLeft <= 0) this.phase = 'approach';
	}
}
