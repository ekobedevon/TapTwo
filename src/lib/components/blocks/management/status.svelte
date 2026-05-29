<script lang="ts">
	import Modal from 'components/modals/modal.svelte';
	import { toast } from 'svelte-sonner';

	let { matches, tournament, active }: { matches: any; tournament: any; active: boolean } =
		$props();
	let selected_match = $state(matches[0]);
	let showChangeScoreModal = $state(false);
	let showEndRoundModal = $state(false);

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
	};

	const endRound = async () => {
		try {
			const response = await fetch(`/manage/${tournament.id}/round/end`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});


			if (response.ok) {
				const { active }: { active: boolean } = await response.json();
				if (active && showEndRoundModal != true) {
					showEndRoundModal = true;
				} else {
					try {
						const response = await fetch(`/manage/${tournament.id}/round/end`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({})
						});
						if (response.ok) {
							const { message }: { message: string } = await response.json();

							window.location.reload();
						}
					} catch (error) {
						console.error('Error:', error);
					}
				}
			}
		} catch (error) {
			console.error('Error:', error);
		}
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

	const CutToTop = async (cut:number) => {
		try {
			const response = await fetch(
				`/manage/${tournament.id}/cut`,
				{
					method: 'POST',
					body: JSON.stringify({ cut})
				}
			);
			showChangeScoreModal = false;
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const confirmModifyScore = async (matchIndex: number) => {
		selected_match = matches[matchIndex];
		showChangeScoreModal = true;
	};
</script>

<div class="flex gap-2">
	<!-- Start will turn into pause once round is started -->
	{#if !active}
		<button class="border-2 p-1" onclick={newRound}>Start Round</button>
		<button class="border-2 p-1" onclick={()=>CutToTop(4)}>Cut to Top</button>
	{:else}
		<button class="border-2 p-1" onclick={() => console.log('PAUSE')}>Pause Round</button>
		<button class="border-2 p-1" onclick={endRound}>End Round</button>
	{/if}
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

<Modal bind:showModal={showEndRoundModal}>
	<h1 class="font-bold">Are you sure you want to end the Round?</h1>
	<h2 class="text-sm">Unreported matches will be marked as Tie.</h2>
	<button class="border-2 p-2" onclick={endRound}> Confirm </button>
</Modal>
