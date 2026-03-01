<script lang="ts">
	import { enhance } from '$app/forms';
	//export let form
</script>

<div>
	<p>Resend verification</p>
	<form use:enhance class="space-y-6" action="#" method="POST">
		<div>
			<label for="email" class="sr-only">Email</label>
			<input
				id="email"
				name="email"
				type="text"
				autocomplete="email"
				required
				class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
				placeholder="email"
			/>
		</div>
		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>Log in</button
			>
		</div>
	</form>
</div>
