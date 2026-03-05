<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import Format from 'components/icons/format.svelte';
	import Game from 'components/icons/game.svelte';
	let { data }: PageProps = $props();
</script>

<div class=" flex w-full flex-col items-center">
	<h1 class="py-2 text-2xl font-bold">Create New Tournament</h1>
    <h1 class="py-2 text-1xl font-bold">Swiss Style</h1>
	<form use:enhance action="#" method="POST" class="flex w-8/10 flex-col gap-4 border-8 md:w-1/2">
		<div class="flex w-full flex-col items-start gap-2">
			<label for="title" class="underline">Title</label>
			<input
				id="title"
				name="title"
				type="text"
				required
				class="w-full rounded-2xl border-2"
				placeholder="We love casting spells"
			/>
		</div>
		<Game />
		<Format />
		<div>
			<label for="description" class="block text-sm/6 font-medium text-gray-900 dark:text-white"
				>Event Description</label
			>
			<div class="mt-2">
				<textarea
					id="description"
					name="description"
					rows="4"
					class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
				></textarea>
			</div>
		</div>
	</form>
</div>
