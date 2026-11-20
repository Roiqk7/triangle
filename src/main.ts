import { config } from './config';
import { Game } from './Game';
import { GameLoop } from './GameLoop';
import { gameKeys } from './input/gameKeys';
import { Keyboard } from './input/Keyboard';
import { readDirections } from './input/playerInput';
import { drawDebug } from './render/screens/drawDebug';
import { drawScreen } from './render/screens/drawScreens';
import { Viewport } from './render/Viewport';
import { WorldRenderer } from './render/WorldRenderer';

/** Creates the parts of the game and connects them. No game rules live here. */
function main(): void {
	const canvas = document.querySelector<HTMLCanvasElement>('#game');
	const ctx = canvas?.getContext('2d');
	if (!canvas || !ctx) throw new Error('Canvas is not available');

	const viewport = new Viewport(canvas, config.arena.width, config.arena.height);
	const worldRenderer = new WorldRenderer();
	const keyboard = new Keyboard(window, gameKeys());
	const game = new Game(Math.random);
	const debug = { visible: false };
	// In development only: lets you inspect and poke the running game from the browser console.
	if (import.meta.env.DEV) Object.assign(window, { game });

	keyboard.onBlur(() => game.pause());
	keyboard.onPress((code) => {
		if (config.keys.start.includes(code)) game.start();
		else if (code === config.keys.pause) game.togglePause();
		else if (code === config.keys.debug) debug.visible = !debug.visible;
	});

	const update = (dt: number): void => {
		const directions = readDirections(
			(code) => keyboard.isHeld(code),
			config.keys.players,
		);
		game.update(directions, dt);
	};

	const render = (): void => {
		viewport.begin(ctx);
		const clock = performance.now() / 1000;
		worldRenderer.draw(ctx, game.world, clock);
		drawScreen(ctx, game.phase, game.world, clock);
		if (!debug.visible) return;
		drawDebug(ctx, {
			fps: loop.fps,
			enemyCount: game.world.enemies.length,
			wave: describeWave(game),
			heldKeys: keyboard.heldCodes(),
		});
	};

	const loop = new GameLoop(1 / config.stepsPerSecond, update, render);
	loop.start();
}

/** For the debug overlay: wave number, phase, and how many are still to walk in. */
function describeWave(game: Game): string {
	const { number, phase, queue } = game.world.wave;
	return `${number} ${phase}, ${queue.length} to come`;
}

main();
