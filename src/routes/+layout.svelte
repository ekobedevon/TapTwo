<script lang="ts">
	import './layout.css';
	import { Toaster } from 'svelte-sonner';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from 'components/navbar.svelte';
	//let temp = $props()
	let { children, data } = $props();
	let user = data.user;
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex w-full flex-col items-center relative">
	<Toaster expand={true} position={'top-right'} richColors />
	<Navbar {user}></Navbar>
	<div class="w-full max-w-350 flex-1 px-4 md:px-0">
		{@render children()}
	</div>
</div>
