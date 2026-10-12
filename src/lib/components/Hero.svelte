<script>
	import Glitch from './Glitch.svelte';
	
	let { title = 'Avencode', subtitle = 'Learn web development through interactive lessons' } = $props();
</script>

<section class="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center" style="background-color: var(--color-cyber-bg);">
	<div class="relative inline-block">
		<Glitch 
			text={title} 
			class="text-4xl font-bold tracking-wider" 
			style="color: var(--color-cyber-cyan);"
			variant="cyan"
		/>
		<!-- Scanline overlay -->
		<div class="absolute inset-0 scanline-bg pointer-events-none"></div>
	</div>
	
	<p class="max-w-2xl text-lg leading-relaxed" style="color: var(--color-cyber-ink);">
		{subtitle}
	</p>
	
	<div class="flex flex-wrap gap-4 justify-center">
		<button class="btn-neon btn-lg">
			<span class="glitch" data-text="Start Learning" variant="cyan">Start Learning</span>
		</button>
		<button class="btn-neon-accent btn-lg">
			<span class="glitch" data-text="Explore Lessons" variant="yellow">Explore Lessons</span>
		</button>
		<button class="btn-neon-danger btn-lg">
			<span class="glitch" data-text="Try Playground" variant="magenta">Try Playground</span>
		</button>
	</div>
	
	<!-- Cyberpunk decorative elements -->
	<div class="absolute bottom-0 left-0 w-full h-4 pointer-events-none" style="background: linear-gradient(to top, var(--color-cyber-bg) 0%, var(--color-cyber-surface) 100%);"></div>
	<div class="absolute top-0 left-0 w-full h-0.5 pointer-events-none" style="background: linear-gradient(90deg, transparent, var(--color-cyber-cyan), transparent);"></div>
</section>

<style>
	@reference "tailwindcss";
	
	/* Additional cyberpunk styling for hero - larger buttons */
	.btn-lg {
		@apply px-6 py-3;
	}
</style>