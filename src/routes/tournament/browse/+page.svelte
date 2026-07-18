<script lang="ts">
	export let data;
	console.log(data);
	const { tournaments } = data;
</script>

<div class="flex flex-col gap-4">
	{#each tournaments as t}
		<a href={`/tournament/view/${t.id}`}>{t.title}</a>
	{/each}
</div>
