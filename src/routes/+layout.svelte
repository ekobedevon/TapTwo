<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from 'components/navbar.svelte';
	//let temp = $props()
	let { children,data} = $props()
	let user = data.user

</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="w-full flex flex-col items-center">
	<Navbar {user}></Navbar>
	<div class="w-full flex-1 max-w-350">
		{@render children()}
	</div>
</div>
