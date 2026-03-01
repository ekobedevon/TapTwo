<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form
	method="post"
	use:enhance
	class=" flex h-96 min-h-full w-full flex-col items-center justify-center gap-8 text-center"
>
	<h1 class="text-4xl font-bold">Confirm Signout</h1>
	<button
		class="w-32 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
		>Sign out</button
	>
</form>
