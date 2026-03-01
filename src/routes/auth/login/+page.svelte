<!-- routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '$lib/components/icons/logo.svelte';
	import Cart from 'components/icons/cart.svelte';
	import G1 from 'components/icons/g1.svelte';
	//import Warning from '$src/lib/components/modals/alerts/warning.svelte';
	//export let form;
</script>

<div class="flex min-h-full w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-sm space-y-10">
		<div class="flex flex-col items-center">
			<h2 class="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-gray-900">
				Welcome back!
			</h2>
		</div>
		<form use:enhance class="space-y-6" action="#" method="POST">
			<div class="relative -space-y-px rounded-md shadow-sm">
				<div
					class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-gray-300 ring-inset"
				></div>
				<div>
					<label for="email" class="sr-only">Email</label>
					<input
						id="email"
						name="email"
						type="text"
						autocomplete="email"
						required
						class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-100 ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-primary focus:ring-inset sm:text-sm sm:leading-6"
						placeholder="email"
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-100 ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-primary focus:ring-inset sm:text-sm sm:leading-6"
						placeholder="Password"
					/>
				</div>
			</div>

			<!-- <div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-900"
						>Remember me</label
					>
				</div>

				<div class="text-sm leading-6">
					<a href="/" class="font-semibold text-primary hover:text-indigo-500"
						>Forgot password?</a
					>
				</div>
			</div> -->

			<div class="flex flex-col gap-2">
				<button
					type="submit"
					class="flex w-1/2 justify-center rounded-md bg-primary px-3 py-1.5 text-sm leading-6 font-semibold text-black hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>Log in</button
				>
				<a
					href="/auth/signup"
					class="flex w-1/2 justify-center rounded-md bg-primary px-3 py-1.5 text-sm leading-6 font-semibold text-black hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>Sign up</a
				>
			</div>
		</form>

		<!-- <p class="text-center text-sm leading-6 text-gray-500">
			Not a member?
			<a href="/" class="font-semibold text-primary hover:text-indigo-500"
				>Start a 14-day free trial</a
			>
		</p> -->
	</div>
</div>

<!-- <Warning
	showModal={form?.message !== undefined}
	header="Account Creation Error"
	body={form?.message}
></Warning> -->
