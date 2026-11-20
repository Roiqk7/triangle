import type { PlayerKeys } from '../config';
import { normalize, type Vec2 } from '../math/vec2';

type IsHeld = (code: string) => boolean;

/** One unit-length (or zero) direction per player, in the order of `bindings`. */
export function readDirections(isHeld: IsHeld, bindings: readonly PlayerKeys[]): Vec2[] {
	return bindings.map((keys) =>
		normalize({
			x: axis(isHeld(keys.right), isHeld(keys.left)),
			y: axis(isHeld(keys.down), isHeld(keys.up)),
		}),
	);
}

/** +1, -1, or 0 when neither or both keys are held. */
function axis(positive: boolean, negative: boolean): number {
	return Number(positive) - Number(negative);
}
