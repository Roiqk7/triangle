/** Colours shared across the drawing code. One-off colours stay next to what they paint. */
export const palette = {
	/** Thick dark line around every character and prop: the cartoon look. */
	outline: '#231f20',
	/** Behind and around the station hall. */
	backdrop: '#15110e',
	shadow: 'rgba(30, 20, 10, 0.28)',

	/** Cap and tank colour of janitor 1, 2 and 3. */
	players: ['#38bdf8', '#facc15', '#f472b6'],
	skin: '#f0c08a',

	sanitizer: '#2dd4bf',
	sanitizerLight: '#ccfbf1',
	foam: '#f0fdfa',

	/** Railway signage: white on blue. */
	signBlue: '#0b4ea2',
	signText: '#ffffff',

	/** Departure board: amber letters on black. */
	boardPanel: '#0d0d0f',
	boardEdge: '#3a3a40',
	boardAmber: '#ffb000',
	boardDim: '#a8780c',
} as const;
