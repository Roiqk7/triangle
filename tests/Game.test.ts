import { describe, expect, it } from 'vitest';
import { config } from '../src/config';
import { Game } from '../src/Game';
import { addEnemy, neverSpawn, NO_MOVEMENT, STEP } from './helpers';

describe('Game', () => {
	it('waits on the title screen until started', () => {
		const game = new Game(neverSpawn);
		game.update(NO_MOVEMENT, STEP);

		expect(game.phase).toBe('title');
		expect(game.world.time).toBe(0);
		expect(game.world.lasers).toHaveLength(3);
	});

	it('runs the clock while playing and freezes it while paused', () => {
		const game = new Game(neverSpawn);
		game.start();
		game.update(NO_MOVEMENT, STEP);
		game.togglePause();
		game.update(NO_MOVEMENT, STEP);

		expect(game.phase).toBe('paused');
		expect(game.world.time).toBeCloseTo(STEP);

		game.togglePause();
		expect(game.phase).toBe('playing');
	});

	it('does not restart a run that is in progress', () => {
		const game = new Game(neverSpawn);
		game.start();
		game.update(NO_MOVEMENT, STEP);
		game.start();

		expect(game.world.time).toBeCloseTo(STEP);
	});

	it('pauses on the catch, then goes to game over, then starts a fresh run', () => {
		const game = new Game(neverSpawn);
		game.start();
		const top = game.world.players[1].position;
		addEnemy(game.world, 'chaser', { x: top.x, y: top.y - 20 });

		game.update(NO_MOVEMENT, STEP);
		expect(game.world.over).toBe(true);
		expect(game.phase).toBe('playing');

		for (let time = 0; time <= config.gameOverDelaySeconds; time += STEP) {
			game.update(NO_MOVEMENT, STEP);
		}
		expect(game.phase).toBe('gameOver');

		game.start();
		expect(game.phase).toBe('playing');
		expect(game.world.enemies).toHaveLength(0);
		expect(game.world.time).toBe(0);
	});
});
