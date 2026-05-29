<script lang="ts">
	import type { player } from 'lib/types/auth_types';
	import { toast } from 'svelte-sonner';
	import Modal from 'components/modals/modal.svelte';

	let showAddPlayerModal: boolean = $state(false);
	let showRemovePlayerModal: boolean = $state(false);
	let showModal: boolean = $state(false);

	let { tournamentID, players }: { tournamentID: string; players: player[] } = $props();

	let userID: string = $state('');
	let entries = $state(players);
	let sample_player: player = {
		wins: 0,
		loses: 0,
		ties: 0,
		username: '',
		id: '',
		points: 0,
		status: 'ACTIVE'
	};
	let selected_player: player = $state(sample_player);

	const add_player = async () => {
		try {
			const response = await fetch(`/manage/${tournamentID}/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userID })
			});
			userID = '';
			showAddPlayerModal = false;
		} catch (error) {
			toast.error('Player already added');
			//console.error('Error:', error);
		}
	};

	const calculateScores = async () => {
		try {
			const response = await fetch(`/manage/${tournamentID}/tabulate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({})
			});
			if (response.ok) {
				const { message } = await response.json();
				toast.success(message);
			}
		} catch (error) {
			toast.error('Error during retabulation');
			//console.error('Error:', error);
		}
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
				const data = await response.json();
				entries = data.entries;
				toast.success('Roster Refreshed');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const removePlayer = async (userID: string) => {
		try {
			const response = await fetch(`/manage/${tournamentID}/remove?userID=${userID}` , {
				method: 'Delete',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userID:userID })
			});
			if (!response.ok) {
				toast.error('Issue removing player, please try again in a moment.');
			} else {
				const data = await response.json();
				toast.success('Player removed,refresh roster to update');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const confirmRemoval = (player: player) => {
		selected_player = player;
		showRemovePlayerModal = true;
	};
</script>

<div class="flex flex-col items-center border-2 border-primary p-2">
	<div class="flex w-72 flex-col gap-3">
		<button class="border-2" onclick={() => (showAddPlayerModal = true)}>Add Player by ID</button>
		<button class="border-2" onclick={calculateScores}>Recalculate Standings</button>
	</div>

	<div class="m-2 flex w-full max-w-96 flex-col items-center gap-2 border-t-2 border-primary p-2">
		<button onclick={refreshPlayerRoster}>Refresh</button>
		<h1 class="underline">Tournament Roster</h1>
		<table class="w-full table-fixed text-left text-sm">
			<thead class="">
				<tr class="">
					<th class="w-1/3">Player</th>
					<th class="text-center">W-L-D</th>
					<th class="text-center">Points</th>
					<th class="text-center">Remove</th>
				</tr>
			</thead>
			<tbody>
				{#each entries as player}
					<tr>
						<td>{player.username}</td>
						<td class="text-center">{player.wins}-{player.loses}-{player.ties}</td>
						<td class="text-center">{player.points || 0}</td>
						<td class="text-center">
							{#if player.status === 'ACTIVE'}
								<button
									class="text-red-600 hover:font-bold hover:underline"
									onclick={() => confirmRemoval(player)}>X</button
								>
							{:else}
								<p>{player.status}</p>
							{/if}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{#if selected_player}
	<Modal bind:showModal={showRemovePlayerModal}>
		<div class="bg-background">
			<p>Are you sure you wanna remove {selected_player.username}?</p>
			<button
				class="text-red-600 hover:font-bold hover:underline"
				onclick={() => removePlayer(selected_player.id)}>Confirm</button
			>
		</div>
	</Modal>
{/if}

<Modal bind:showModal={showAddPlayerModal}>
	<div class="flex w-72 flex-col gap-3">
		<p>Add Players</p>
		<input type="text" bind:value={userID} />
		<button class="border-2" onclick={add_player}>Add</button>
	</div>
</Modal>
