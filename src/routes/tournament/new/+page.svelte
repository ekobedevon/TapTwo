<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import Format from 'components/format.svelte';
	import Game from 'components/game.svelte';
	let { data }: PageProps = $props();
</script>

<div class=" flex w-full flex-col items-center text-black">
	<h1 class="py-2 text-2xl font-bold">Create New Tournament</h1>
	<h1 class="text-1xl py-2 font-bold">Swiss Style</h1>
	<form use:enhance action="#" method="POST" class="flex w-8/10 flex-col gap-4 md:w-1/2">
		<div class="flex w-full flex-col items-start gap-2">
			<label for="title" class="">Title</label>
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
			<label for="description" class="block text-sm/6 font-medium text-gray-900"
				>Event Description</label
			>
			<div class="mt-2">
				<textarea
					id="description"
					name="description"
					rows="4"
					class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
				></textarea>
			</div>
		</div>
		<button
			type="submit"
			class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
		>
			Submit
		</button>
	</form>
</div>
