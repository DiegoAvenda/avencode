<script>
	/**
	 * Glitch text effect component.
	 * Uses the cyberpunk glitch animation defined in layout.css (@layer components).
	 * The effect works by creating ::before and ::after pseudo-elements with the same text,
	 * then animating them with clip-path and transform to create the glitch visual.
	 *
	 * @prop {string} text - The text to display with glitch effect
	 * @prop {string} [class=''] - Additional CSS classes
	 * @prop {boolean} [animate=true] - Whether to animate the glitch
	 * @prop {'cyan'|'magenta'|'yellow'} [variant='cyan'] - Color variant for the glitch layers
	 */
	let { text, class: extraClass = '', animate = true, variant = 'cyan' } = $props();
</script>

<span
	class="glitch inline-block {extraClass}"
	data-text={text}
	data-variant={variant}
	role="img"
	aria-label={text}
	style={animate ? undefined : 'animation: none;'}
>
	{text}
</span>

<style>
	/* Override the glitch colors based on variant */
	:global(.glitch[data-variant="magenta"]::before) {
		background: var(--color-cyber-magenta);
	}
	:global(.glitch[data-variant="magenta"]::after) {
		background: var(--color-cyber-cyan);
	}

	:global(.glitch[data-variant="yellow"]::before) {
		background: var(--color-cyber-yellow);
	}
	:global(.glitch[data-variant="yellow"]::after) {
		background: var(--color-cyber-magenta);
	}

	:global(.glitch[data-variant="cyan"]::before) {
		background: var(--color-cyber-cyan);
	}
	:global(.glitch[data-variant="cyan"]::after) {
		background: var(--color-cyber-magenta);
	}
</style>