<script lang="ts">
	import Player from 'components/blocks/management/player_block.svelte';
	import type { player } from 'lib/types/auth_types';
	
	const { data } = $props();
	const { tournament, players }: { tournament: any; players: player[] } = data;
	const tournamentID = tournament.id;
	let player_list = $state(players);
	
</script>

<div class="flex flex-col">
	<Player {tournamentID} players={player_list}></Player>
</div>
