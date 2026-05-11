<script lang="ts">
	import Modal from 'components/modals/modal.svelte';

	let { matches, tournament }: { matches: any; tournament: any } = $props();
	let selected_match = $state(matches[0]);
	let selected_index = $state(0);
	let showChangeScoreModal = $state(false);
	const newRound = async () => {
		try {
			const response = await fetch(`/manage/${tournament.id}/round/start`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({})
			});
		} catch (error) {
			console.error('Error:', error);
		}

		// try {
		// 	const response = await fetch(`/manage/${tournamentID}/add`, {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify({ userID })
		// 	});
		// 	userID = '';
		// 	showAddPlayerModal = false;
		// } catch (error) {
		// 	toast.error('Player already added');
		// 	//console.error('Error:', error);
		// }
	};
	const ModifyScore = async () => {
		try {
			const response = await fetch(
				`/manage/${tournament.id}/report/admin?match=${selected_match.id}`,
				{
					method: 'POST',
					body: JSON.stringify({ selected_match })
				}
			);
			showChangeScoreModal = false;
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const confirmModifyScore = async (matchIndex: number) => {
		selected_match = matches[matchIndex];
		selected_index = matchIndex;
		console.log(selected_match);
		showChangeScoreModal = true;
	};
</script>

<div class="grid grid-cols-4 gap-2">
	<!-- Start will turn into pause once round is started -->
	<button class="border-2 p-1" onclick={newRound}>Start Round</button>
	<button class="border-2 p-1">End Round</button>
	<button class="border-2 p-1">Next Round</button>
	<button class="border-2 p-1">Cut to Top</button>
</div>
<div class="pt-2 text-center">
	<p>Round {tournament.rounds}</p>

	<table class="w-full max-w-96 table-fixed text-left">
		<thead class="">
			<tr class="">
				<th class="">Player A</th>
				<th class="text-center">Results</th>
				<th class="text-center">Player B</th>
			</tr>
		</thead>
		<tbody>
			{#each matches as match, index}
				<tr>
					<td class="text-wrap">{match.player_a}</td>
					<td class="text-center"
						>{#if match.player_a === match.player_b}
							BYE
						{:else}
							<button class="hover:border-2" onclick={() => confirmModifyScore(index)}
								>{match.player_a_score}-{match.player_b_score}</button
							>
						{/if}
					</td>
					<td class="text-wrap">{match.player_b}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Modal bind:showModal={showChangeScoreModal}>
	{#if selected_match}
		<div class="flex gap-2">
			<label class="w-3/4" for="player a score">{selected_match.player_a}'s score</label>
			<input
				name="player a score"
				class="w-16"
				min="0"
				bind:value={selected_match.player_a_score}
				type="number"
			/>
		</div>
		<div class="flex gap-2">
			<label class="w-3/4" for="player a score">{selected_match.player_b}'s score</label>
			<input
				name="player b score"
				class="w-16"
				min="0"
				bind:value={selected_match.player_b_score}
				type="number"
			/>
		</div>
		<button class="border-2 p-2" onclick={ModifyScore}> Confirm </button>
	{/if}
</Modal>
