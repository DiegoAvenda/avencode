<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { lessonList, modules, phases } from '#lib/content/notas/lessons.js';
	import { createProgressStore } from '#lib/stores/progress.svelte.js';

	const progress = createProgressStore();
	const course = modules[0];

	let ready = $state(false);
	onMount(() => {
		ready = true;
		progress.pullFromServer();
	});

	const currentLesson = $derived(ready ? (progress.currentLesson ?? 1) : 1);
	const currentEntry = $derived(
		lessonList.find((entry) => entry.id === currentLesson) ?? lessonList[0]
	);
	const currentModule = $derived(
		modules.find((entry) => currentLesson >= entry.from && currentLesson <= entry.to) ?? modules[0]
	);
	const started = $derived(currentLesson > 1 || progress.completedLessons.length > 0);
	const completedTotal = $derived(progress.completedLessons.length);
	const progressPercent = $derived(Math.round((completedTotal / lessonList.length) * 100));
	const callToAction = $derived(started ? `Continue: Lesson ${currentLesson}` : 'Start Lesson 1');

	const total = $derived(course.to - course.from + 1);
	const doneCount = $derived(
		ready
			? progress.completedLessons.filter((id) => id >= course.from && id <= course.to).length
			: 0
	);
	const percent = $derived(Math.round((doneCount / total) * 100));

	/** @param {number} id */
	function isChallenge(id) {
		return lessonList.find((entry) => entry.id === id)?.type === 'challenge';
	}

	/** @param {{ from: number, to: number }} phase */
	function lessonsOf(phase) {
		return lessonList.filter((entry) => entry.id >= phase.from && entry.id <= phase.to);
	}

	/** @param {(typeof modules)[number]} module */
	function lessonsOfModule(module) {
		return lessonList.filter((entry) => entry.id >= module.from && entry.id <= module.to);
	}

	/** @param {(typeof modules)[number]} module */
	function completedOf(module) {
		return lessonsOfModule(module).filter((entry) => progress.isCompleted(entry.id)).length;
	}

	/** @param {(typeof modules)[number]} module */
	function percentOf(module) {
		const totalLessons = lessonsOfModule(module).length;
		return totalLessons === 0 ? 0 : Math.round((completedOf(module) / totalLessons) * 100);
	}

	/** @param {(typeof modules)[number]} module */
	function resumeHref(module) {
		const target =
			currentLesson >= module.from && currentLesson <= module.to ? currentLesson : module.from;
		return `/lesson/${target}`;
	}

	/** @param {(typeof modules)[number]} module */
	function phasesOf(module) {
		return phases.filter((phase) => phase.from >= module.from && phase.to <= module.to);
	}

	/** Tech badges rotate through the three neon accents. */
	const BADGE_STYLES = [
		'border-cyber-yellow text-cyber-yellow bg-cyber-yellow/10',
		'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10',
		'border-cyber-magenta text-cyber-magenta bg-cyber-magenta/10'
	];

	/** @param {number} index */
	function badgeClass(index) {
		return (
			'border px-2 py-1 text-[11px] tracking-wider uppercase ' +
			BADGE_STYLES[index % BADGE_STYLES.length]
		);
	}

	/* Repeated class strings, written in full so Tailwind can see them while scanning. */
	const SECTION = 'relative mx-auto w-full max-w-5xl px-6 py-14';
	const EYEBROW = 'm-0 text-[11px] tracking-[0.3em] text-cyber-cyan uppercase';
	const H2 = 'm-0 mt-2 text-2xl font-black tracking-tight text-white uppercase sm:text-3xl';
	const LEAD = 'm-0 mt-3 max-w-3xl text-sm leading-relaxed text-gray-400';
	const PRIMARY_BUTTON =
		'clip-button inline-flex items-center gap-2 bg-cyber-yellow px-7 py-3 text-sm font-bold tracking-wider text-cyber-bg uppercase transition-all duration-300 hover:bg-cyber-cyan hover:shadow-neon-cyan';
	const SECONDARY_BUTTON =
		'clip-button inline-flex items-center gap-2 border-2 border-cyber-magenta bg-transparent px-7 py-3 text-sm font-bold tracking-wider text-cyber-magenta uppercase transition-all duration-300 hover:bg-cyber-magenta hover:text-white hover:shadow-neon-magenta';
	const OUTLINE_BUTTON =
		'clip-button inline-flex items-center justify-center border border-cyber-cyan bg-transparent px-4 py-3 text-sm font-bold tracking-wider text-cyber-cyan uppercase transition-all duration-300 hover:bg-cyber-cyan hover:text-black hover:shadow-neon-cyan';
</script>

<svelte:head>
	<title>Avencode — learn web development through interactive lessons</title>
	<meta
		name="description"
		content="A browser-based frontend course: build projects, with interactive lessons and real-time feedback."
	/>
</svelte:head>

<div class="relative min-h-screen bg-cyber-bg text-ink">
	<!-- Background decorations -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute top-1/4 right-0 h-64 w-64 rounded-full bg-cyber-cyan/10 blur-[100px]"
	></div>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyber-magenta/10 blur-[120px]"
	></div>

	<nav
		class="sticky top-0 z-50 border-b-2 border-cyber-cyan bg-cyber-bg/90 backdrop-blur-sm"
		aria-label="Main"
	>
		<div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
			<span class="text-sm font-bold tracking-widest text-white uppercase">Avencode</span>
			<a href="/lesson/{currentLesson}" class="clip-button {PRIMARY_BUTTON}">▶ {callToAction}</a>
		</div>
	</nav>

	<header class="relative px-6 pt-14 pb-10">
		<div class="mx-auto flex w-full max-w-5xl flex-col gap-5">
			<p class={EYEBROW}>&gt; root@localhost:~$ ./avencode --init</p>
			<div class="glitch-wrapper">
				<h1
					class="glitch m-0 text-3xl leading-none font-black tracking-tighter text-white uppercase sm:text-5xl md:text-6xl"
					data-text="Avencode"
				>
					Avencode
				</h1>
			</div>
			<p class="m-0 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
				Learn web development through interactive lessons — starting from zero.
			</p>
			<p class="m-0 max-w-2xl text-sm leading-relaxed text-gray-400">
				No previous experience required: the course explains every word the first time it appears.
				You write your first line of code in lesson 1 and finish with projects you can show.
			</p>

			<div class="mt-1 flex flex-wrap items-center gap-3">
				<a href="/lesson/{currentLesson}" class="clip-button {PRIMARY_BUTTON}">
					▶ {callToAction}
				</a>
				<a href="#projects" class="clip-button {SECONDARY_BUTTON}">What you'll build ↓</a>
			</div>

			{#if started}
				<div class="mt-2 flex max-w-xl flex-col gap-2">
					<div
						class="flex items-center justify-between text-[11px] tracking-widest text-gray-500 uppercase"
					>
						<span>Your progress · {completedTotal}/{lessonList.length} lessons</span>
						<span class="text-cyber-cyan tabular-nums">{progressPercent}%</span>
					</div>
					<div class="h-1 w-full bg-gray-800">
						<div
							class="h-full bg-cyber-cyan shadow-neon-cyan"
							style="width: {progressPercent}%"
						></div>
					</div>
					<p class="m-0 text-xs text-gray-500">
						Next up: {currentModule.project} // {currentEntry.title}
					</p>
				</div>
			{/if}

			<ul
				class="mt-3 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0 text-[11px] tracking-widest text-gray-400 uppercase sm:grid-cols-4"
			>
				<li class="border-l-2 border-l-cyber-yellow pl-3">
					<span class="block text-lg text-cyber-yellow">{total}</span>
					Interactive lessons
				</li>
				<li class="border-l-2 border-l-cyber-cyan pl-3">
					<span class="block text-lg text-cyber-cyan">100%</span>
					Runs in your browser
				</li>
				<li class="border-l-2 border-l-cyber-magenta pl-3">
					<span class="block text-lg text-cyber-magenta">0</span>
					Installs needed to start
				</li>
				<li class="border-l-2 border-l-cyber-cyan pl-3">
					<span class="block text-lg text-cyber-cyan">Real-time</span>
					Code feedback
				</li>
			</ul>
		</div>
	</header>

	<main>
		<!-- What you'll build -->
		<section id="projects" class={SECTION}>
			<p class={EYEBROW}>&gt; projects --list</p>
			<h2 class={H2}>What you'll build</h2>
			<p class={LEAD}>
				Every project is a real app, not a toy exercise. You build it right here in the browser, and
				it ends up documented. And if you want the technical summary behind a project, every card has
				a "technical detail" section you can open.
			</p>

			<div class="mt-8 grid gap-6 lg:grid-cols-2">
				{#each modules as module, index (module.id)}
					<article
						class="clip-card group relative border border-gray-800 bg-cyber-surface transition-colors duration-300 hover:border-cyber-cyan"
					>
						<div
							class="flex items-center justify-between border-b border-gray-800 bg-black/50 px-4 py-2 text-[11px] tracking-widest text-gray-500 uppercase"
						>
							<span>SYS.DAT // 0X0{index + 1}</span>
							<span class="text-cyber-cyan">
								STATUS: {completedOf(module) > 0 ? 'IN PROGRESS' : 'READY'}
							</span>
						</div>

						<div class="flex flex-col gap-4 p-6">
							<div class="flex flex-col gap-1">
								<h3
									class="m-0 text-xl font-bold tracking-wide text-white uppercase transition-colors group-hover:text-cyber-cyan"
								>
									{module.label}
								</h3>
								<p class="m-0 text-xs tracking-widest text-cyber-yellow uppercase">
									PROJECT: {module.project}
								</p>
							</div>

							<p class="m-0 text-sm leading-relaxed text-gray-300">{module.pitch}</p>

							<details class="border-t border-gray-800 pt-3">
								<summary
									class="cursor-pointer list-none text-[11px] tracking-widest text-gray-500 uppercase hover:text-cyber-cyan [&::-webkit-details-marker]:hidden"
								>
									▸ Technical detail
								</summary>
								<p class="mt-2 mb-0 text-xs leading-relaxed text-gray-500">
									{module.description}
								</p>
							</details>

							<ul class="m-0 flex list-none flex-wrap gap-2 p-0">
								{#each module.stack as tool, toolIndex (tool)}
									<li class={badgeClass(toolIndex)}>{tool}</li>
								{/each}
							</ul>

							<ul class="m-0 flex list-none flex-col gap-1 p-0">
								{#each phasesOf(module) as phase (phase.id)}
									<li class="flex items-start gap-2 text-xs text-gray-500">
										<span class="text-cyber-cyan">&gt;</span>
										<span>{phase.label}</span>
									</li>
								{/each}
							</ul>

							<div class="mt-auto flex flex-col gap-3">
								<div
									class="flex items-center justify-between text-[11px] tracking-widest text-gray-500 uppercase"
								>
									<span>{completedOf(module)}/{lessonsOfModule(module).length} lessons</span>
									<span class="text-cyber-cyan tabular-nums">{percentOf(module)}%</span>
								</div>
								<div class="h-1 w-full bg-gray-800">
									<div
										class="h-full bg-cyber-cyan shadow-neon-cyan"
										style="width: {percentOf(module)}%"
									></div>
								</div>
								<a href={resumeHref(module)} class={OUTLINE_BUTTON}>
									{completedOf(module) > 0 ? 'Continue module' : 'Start module'}
								</a>
							</div>
						</div>

						<div
							aria-hidden="true"
							class="absolute right-0 bottom-0 h-8 w-8 border-r-2 border-b-2 border-cyber-cyan opacity-0 transition-opacity group-hover:opacity-100"
						></div>
					</article>
				{/each}
			</div>
		</section>

		<!-- Final call to action -->
		<section class={SECTION}>
			<div class="clip-card border border-cyber-cyan bg-cyber-surface p-7 shadow-neon-cyan">
				<p class="m-0 text-sm text-cyber-cyan">&gt; root@localhost:~$ ./lesson-01 --open</p>
				<h2 class="mt-3 mb-3 text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
					Your first lesson is one click away
				</h2>
				<p class="m-0 mb-6 max-w-2xl text-sm leading-relaxed text-gray-400">
					Lesson 1 needs no setup and no prior knowledge. If something breaks, the console under the
					preview shows what the browser saw, and every lesson repeats the idea behind it in plain
					words.
				</p>
				<div class="flex flex-wrap items-center gap-3">
					<a href="/lesson/{currentLesson}" class="clip-button {PRIMARY_BUTTON}">
						▶ {callToAction}
					</a>
					<span class="text-xs tracking-widest text-gray-500 uppercase">
						{currentModule.project} // {currentEntry.title}
					</span>
				</div>
			</div>
		</section>
	</main>

	<footer class="relative border-t border-gray-800 px-6 pt-14 pb-10">
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyber-cyan bg-black px-4 py-1 text-[11px] tracking-widest text-cyber-cyan uppercase"
		>
			End of transmission
		</div>
		<div class="clip-card mx-auto max-w-5xl border border-gray-800 bg-cyber-surface p-6">
			<p class="m-0 mb-3 text-sm text-cyber-cyan">&gt; root@localhost:~$ cat curriculum.md</p>
			<p class="m-0 text-xs leading-relaxed text-gray-400">
				Interactive lessons, real-time feedback, and projects you can show. Everything runs in the
				browser, progress is saved in localStorage, and nothing leaves your machine.
			</p>
		</div>
	</footer>
</div>
