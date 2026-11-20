/** A colour as red, green and blue, each 0 to 255. */
export type Rgb = readonly [number, number, number];

/** The colour `amount` of the way from `from` to `to`, as a CSS colour. */
export function blend(from: Rgb, to: Rgb, amount: number, opacity = 1): string {
	const share = Math.min(1, Math.max(0, amount));
	const [r, g, b] = from.map((channel, index) =>
		Math.round(channel + (to[index] - channel) * share),
	);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
