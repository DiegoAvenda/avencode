<script>
	import { resolve } from '$app/paths';
</script>

<header class="border-b border-cyber-line bg-cyber-surface shadow-[--shadow-neon-cyan]">
	<div class="mx-auto flex h-16 w-full max-w-4xl items-center gap-4 px-4">
		<div class="flex-1">
			<a
				href={resolve('/')}
				class="inline-block rounded px-3 py-2 text-xl font-bold text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg transition-colors"
			>
				<span class="glitch" data-text="avencode">avencode</span>
			</a>
		</div>
		<nav class="flex flex-none items-center gap-2">
			<details class="relative">
				<summary
					class="flex cursor-pointer list-none items-center rounded-full p-2 text-cyber-ink hover:bg-cyber-surface [&::-webkit-details-marker]:hidden"
					aria-label="Cart, 8 items"
				>
					<span class="relative inline-block">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						<span
							class="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-cyber-magenta px-1 text-[11px] font-bold text-white"
							>8</span
						>
					</span>
				</summary>
				<div
					class="absolute right-0 z-10 mt-3 w-52 rounded-xl border border-cyber-line bg-cyber-surface shadow-[--shadow-neon-magenta]"
				>
					<div class="p-4">
						<span class="text-lg font-bold text-cyber-ink">8 Items</span>
						<span class="mt-1 block text-sm text-cyber-cyan">Subtotal: $999</span>
						<div class="mt-3">
							<button
								class="block w-full rounded bg-cyber-cyan px-4 py-2 text-sm font-bold text-cyber-bg hover:bg-cyber-yellow transition-colors"
							>
								View cart
							</button>
						</div>
					</div>
				</div>
			</details>
			<details class="relative">
				<summary
					class="flex cursor-pointer list-none items-center rounded-full p-1 text-cyber-ink hover:bg-cyber-surface [&::-webkit-details-marker]:hidden"
					aria-label="Account menu"
				>
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full bg-cyber-surface text-sm font-bold text-cyber-ink"
						aria-hidden="true"
					>
						AV
					</span>
				</summary>
				<ul
					class="absolute right-0 z-10 mt-3 w-52 rounded-xl border border-cyber-line bg-cyber-surface shadow-[--shadow-neon-magenta] p-2"
				>
					<li>
						<a
							href={resolve('/')}
							class="flex items-center justify-between rounded px-3 py-2 text-sm text-cyber-ink hover:bg-cyber-surface hover:text-cyber-cyan transition-colors"
						>
							Profile
							<span
								class="rounded-full bg-cyber-surface px-2 py-0.5 text-[11px] font-bold text-cyber-yellow"
								>New</span
							>
						</a>
					</li>
					<li>
						<a
							href={resolve('/')}
							class="block rounded px-3 py-2 text-sm text-cyber-ink hover:bg-cyber-surface hover:text-cyber-cyan transition-colors"
						>
							Settings
						</a>
					</li>
					<li>
						<a
							href={resolve('/')}
							class="block rounded px-3 py-2 text-sm text-cyber-ink hover:bg-cyber-surface hover:text-cyber-cyan transition-colors"
						>
							Logout
						</a>
					</li>
				</ul>
			</details>
		</nav>
	</div>
</header>

