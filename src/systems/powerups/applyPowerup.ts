import { config, type EffectKind, type PowerupKind } from '../../config';
import { distance } from '../../math/vec2';
import type { Player } from '../../world/Player';
import type { World } from '../../world/World';

type PickupAction = (world: World, picker: Player) => void;

/** How big a splash must start for its ring to grow to the foam bomb's full reach. */
const SPLASH_GROWTH = 3.4;

/** What happens when each kind of power-up is picked up. Add a kind by adding a line. */
const actions: Record<PowerupKind, PickupAction> = {
	coffee: (world) => startEffect(world, 'coffee'),
	longHose: (world) => startEffect(world, 'longHose'),
	pressure: (world) => startEffect(world, 'pressure'),
	wetFloor: (world) => startEffect(world, 'wetFloor'),
	shield: addShield,
	foamBomb: soakEveryoneNearby,
};

export function applyPowerup(world: World, kind: PowerupKind, picker: Player): void {
	actions[kind](world, picker);
}

/** Picking up a running effect again restarts its clock; it does not stack. */
function startEffect(world: World, effect: EffectKind): void {
	world.effects[effect] = config.powerups.effectSeconds[effect];
}

function addShield(world: World): void {
	world.shields = Math.min(config.powerups.maxShields, world.shields + 1);
}

function soakEveryoneNearby(world: World, picker: Player): void {
	const { foamBombRadius, foamBombDamage } = config.powerups;
	for (const enemy of world.enemies) {
		if (distance(enemy.position, picker.position) <= foamBombRadius + enemy.radius) {
			enemy.hp -= foamBombDamage;
		}
	}
	world.splashes.push({
		position: picker.position,
		radius: foamBombRadius / SPLASH_GROWTH,
		startedAt: world.time,
	});
}
