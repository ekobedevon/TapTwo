<script lang="ts">
	let { matches, tournament }: { matches: any; tournament: any } = $props();
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
			{#each matches as match}
				<tr>
					<td class="text-wrap">{match.player_a}</td>
					<td class="text-center"
						>{#if match.player_a === match.player_b}
							BYE
						{:else}
							{match.player_a_score}-{match.player_b_score}
						{/if}
					</td>
					<td class="text-wrap">{match.player_b}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
