type PressListener = (code: string) => void;
type BlurListener = () => void;

/** Tracks which keys are held. Keys are identified by physical position (event.code). */
export class Keyboard {
	private readonly held = new Set<string>();
	private readonly pressListeners: PressListener[] = [];
	private readonly blurListeners: BlurListener[] = [];

	/** `gameKeys` are the codes the game uses; their browser default (scrolling) is blocked. */
	constructor(
		target: Window,
		private readonly gameKeys: ReadonlySet<string>,
	) {
		target.addEventListener('keydown', (event) => this.handleKeyDown(event));
		target.addEventListener('keyup', (event) => this.held.delete(event.code));
		target.addEventListener('blur', () => this.handleBlur());
	}

	isHeld(code: string): boolean {
		return this.held.has(code);
	}

	heldCodes(): string[] {
		return [...this.held];
	}

	/** Called once per physical press, not for auto-repeat. */
	onPress(listener: PressListener): void {
		this.pressListeners.push(listener);
	}

	onBlur(listener: BlurListener): void {
		this.blurListeners.push(listener);
	}

	private handleKeyDown(event: KeyboardEvent): void {
		// Leave browser shortcuts such as Cmd+R alone.
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		if (this.gameKeys.has(event.code)) event.preventDefault();
		if (event.repeat) return;

		this.held.add(event.code);
		this.pressListeners.forEach((listener) => listener(event.code));
	}

	/** A key released while the window is unfocused never reports its release, so forget all. */
	private handleBlur(): void {
		this.held.clear();
		this.blurListeners.forEach((listener) => listener());
	}
}
