<script lang="ts">
	import type { player } from 'lib/types/auth_types';
	import { toast } from 'svelte-sonner';
	export let tournamentID: string = '';
	export let players: player[] = [];
	let userID: string = '';

	const add_player = async () => {
		try {
			const respone = await fetch(`/manage/${tournamentID}/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userID })
			});
		} catch (error) {
			console.error('Error:', error);
		}
		userID = '';
	};

	const refreshPlayerRoster = async () => {
		try {
			const response = await fetch(`/manage/${tournamentID}/list`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) {
				toast.error('Issue refreshing page, please try again in a moment.');
			} else {
				console.log("SUCCESS")
				toast.success('Roster Refreshed');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	
</script>

<div class="flex flex-col gap-3">
	<p>Add Player</p>
	<input type="text" bind:value={userID} />
	<button class="border-2" onclick={add_player}>Add</button>
</div>
<div class="">
	<button onclick={refreshPlayerRoster}>Refresh</button>
	{#each players as player}
		<div class="">
			<p>{player.username}</p>
		</div>
	{/each}
</div>
