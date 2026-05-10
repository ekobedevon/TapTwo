<script lang="ts">
	import Player from 'components/blocks/management/player_block.svelte';
	import Status from 'components/blocks/management/status.svelte';
	import Modal from 'components/modals/modal.svelte';
	import type { player } from 'lib/types/auth_types';

	const { data } = $props();
	const {
		tournament,
		organizer,
		players
	}: { tournament: any; organizer: string; players: player[] } = data;
	const tournamentID = tournament.id;
	let player_list = $state(players);
	const options = ['Roster', 'Matchups'];
	let current_player_list = $state(options[1]);
</script>

<div class="flex w-full flex-col items-center justify-center">
	<div class="flex flex-col items-center">
		<h1 class="font-bold">{tournament.title}</h1>
		<h3><span class="pr-1 font-bold">Organizer:</span>{organizer}</h3>
		<p>Current Round: {tournament.rounds ? tournament.rounds : 'TBD'}</p>
	</div>
	<div class="flex gap-1 py-2">
		{#each options as option}
			{#if option === current_player_list}
				<button
					class="border-2 border-primary bg-primary px-2 py-1 text-background"
					onclick={() => (current_player_list = option)}>{option}</button
				>
			{:else}
				<button
					class="border-2 border-primary px-2 py-1 text-primary hover:bg-primary hover:text-background"
					onclick={() => (current_player_list = option)}>{option}</button
				>
			{/if}
		{/each}
	</div>
	{#if current_player_list === 'Roster'}
		<Player {tournamentID} players={player_list}></Player>
	{:else if current_player_list === 'Matchups'}
	<Status></Status>
		{/if}

</div>
