<script>
	let show_profile = false;
	let show_mobile = false;
	let current = 'Home';
	let options = [
		{ title: 'Home', path: '/' },
		{ title: 'Tournaments', path: '/' },
		{ title: 'Dashboard', path: '/' }
	];
</script>

<!-- Include this script tag or install `@tailwindplus/elements` via npm: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script> -->
<nav
	class="relative bg-background dark:bg-background/50 dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-white/10"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<div class="mr-2 -ml-2 flex items-center md:hidden">
					<!-- Mobile menu button -->
					<button
						type="button"
						on:click={() => (show_mobile = !show_mobile)}
						class="text-body relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-primary focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
					>
						<span class="absolute -inset-0.5"></span>
						<span class="sr-only">Open main menu</span>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							data-slot="icon"
							aria-hidden="true"
							class="size-6 in-aria-expanded:hidden"
						>
							<path
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							data-slot="icon"
							aria-hidden="true"
							class="size-6 not-in-aria-expanded:hidden"
						>
							<path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</div>
				<div class="flex shrink-0 items-center">
					<!-- <img
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
						alt="Your Company"
						class="h-8 w-auto text-primary"
					/> -->
				</div>
				<div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
					<!-- Current: "bg-gray-900 dark:bg-gray-950/50 text-white", Default: "text-gray-300 hover:bg-accent hover:text-primary" -->
					{#each options as option}
						{#if option.title == current}
							<a
								href={option.path}
								aria-current="page"
								class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white dark:bg-gray-950/50"
								>{option.title}</a
							>
						{:else}
							<a
								href={option.path}
								class="rounded-md px-3 py-2 text-sm font-medium text-text hover:bg-primary/5"
								>{option.title}</a
							>
						{/if}
					{/each}
				</div>
			</div>
			<div class="flex items-center">
				<div class="shrink-0">
					<button
						type="button"
						class="relative inline-flex items-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:shadow-none"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
							/>
						</svg>

						New Tournament
					</button>
				</div>
				<div class="hidden md:ml-4 md:flex md:shrink-0 md:items-center">
					<button
						type="button"
						class="text-body dark:text-body relative rounded-full p-1 hover:text-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
					>
						<span class="absolute -inset-1.5"></span>
						<span class="sr-only">View notifications</span>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							data-slot="icon"
							aria-hidden="true"
							class="size-6"
						>
							<path
								d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>

					<!-- Profile dropdown -->
					<div class="relative ml-3">
						<button
							on:click={() => (show_profile = !show_profile)}
							// popovertarget="profileDropdown"
							class="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						>
							<span class="absolute -inset-1.5"></span>
							<span class="sr-only">Open user menu</span>
							<img
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
								class="size-8 rounded-full bg-background outline -outline-offset-1 outline-white/10"
							/>
						</button>

						{#if show_profile}
							<div
								id="profileDropdown"
								class="absolute right-0 w-48 rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-background dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
							>
								<a
									href="/"
									class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden dark:text-gray-200 dark:focus:bg-accent"
									>Your profile</a
								>
								<a
									href="/"
									class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden dark:text-gray-200 dark:focus:bg-accent"
									>Settings</a
								>
								<a
									href="/auth/sighnout"
									class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden dark:text-gray-200 dark:focus:bg-accent"
									>Sign out</a
								>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
	<!--------------MOBILE BAR-------------->
	{#if show_mobile}
		<div id="mobile-menu" class="block bg-background md:hidden">
			<div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
				<!-- Current: "bg-gray-900 dark:bg-gray-950/50 text-white", Default: "text-gray-300 hover:bg-accent hover:text-primary" -->

				{#each options as option}
					{#if option.title == current}
						<a
							href={option.path}
							aria-current="page"
							class="block rounded-md bg-primary px-3 py-2 text-base font-medium text-white dark:bg-gray-950/50"
							>{option.title}</a
						>
					{:else}
						<a
							href={option.path}
							class="block rounded-md px-3 py-2 text-base font-medium text-text hover:bg-accent hover:text-text"
							>{option.title}</a
						>
					{/if}
				{/each}
				<!--  -->
			</div>
			<div class="border-t border-white/10 pt-4 pb-3">
				<div class="flex items-center px-5 sm:px-6">
					<div class="shrink-0">
						<img
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
							class="size-10 rounded-full bg-background outline -outline-offset-1 outline-white/10"
						/>
					</div>
					<div class="ml-3">
						<div class="text-body text-base font-medium">Tom Cook</div>
						<div class="text-body text-sm font-medium">tom@example.com</div>
					</div>
					<button
						type="button"
						class="text-body relative ml-auto shrink-0 rounded-full p-1 hover:text-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
					>
						<span class="absolute -inset-1.5"></span>
						<span class="sr-only">View notifications</span>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							data-slot="icon"
							aria-hidden="true"
							class="size-6"
						>
							<path
								d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>
				<div class="mt-3 space-y-1 px-2 sm:px-3">
					<a
						href="/"
						class="text-body block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-text"
						>Your profile</a
					>
					<a
						href="/"
						class="text-body block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-text"
						>Settings</a
					>
					<a
						href="/auth/signout"
						class="text-body block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-text"
						>Sign out</a
					>
				</div>
			</div>
		</div>
	{/if}
</nav>
