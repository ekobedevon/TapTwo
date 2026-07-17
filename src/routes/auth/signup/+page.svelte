<!-- routes/signup/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '$lib/components/icons/logo.svelte';
	let password: string;
	let repeat: string;
	let email:string = "";
	//import Warning from '$src/lib/components/modals/alerts/warning.svelte';
	let matching: boolean = $state(true);
	let validEmail: boolean = $state(true)

	var timeout: any;

	const checkMatch = async () => {
		
		if (password === repeat) matching = true;
		else matching = false;
	};
	const checkEmail = async () => {
		console.log('Check Email');
		if(typeof email !== 'string' ||
			email.length < 3 ||
			email.length > 60 ||
			!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.toLowerCase()))
			{
				validEmail = false
			}
		else{
			validEmail = true
		}
		console.log(validEmail)
	}

	const keyCheck = async () => {
		if (repeat) {
			clearTimeout(timeout);
			timeout = setTimeout(checkMatch, 500);
		} else {
			timeout = setTimeout(checkMatch, 500);
		}
	};
</script>

<div class="flex min-h-full w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-sm space-y-10">
		<div class="flex flex-col items-center">
			<!-- <Logo classData="h-16 w-auto" /> -->
			<h2 class="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-gray-900">
				Create a new account
			</h2>
			{#if !validEmail}
				<p class="text-xs font-bold text-red-600 italic opacity-70">Invalid Email</p>
			{/if}
			{#if !matching}
				<p class="text-xs font-bold text-red-600 italic opacity-70">Password must match</p>
			{/if}
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
						placeholder="Email"
						bind:value={email}
						onchange={checkEmail}
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
						bind:value={password}
					/>
				</div>
				<div>
					<label for="repeatpassword" class="sr-only">Password</label>
					<input
						id="repeatpassword"
						name="repeatpassword"
						type="password"
						autocomplete="current-password"
						required
						class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-100 ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-primary focus:ring-inset sm:text-sm sm:leading-6"
						placeholder="Repeat Password"
						bind:value={repeat}
						onchange={keyCheck}
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

			<div class="flex flex-col items-center gap-2">
				<button
					type="submit"
					class="flex w-1/2 justify-center rounded-md bg-primary px-3 py-1.5 text-sm leading-6 font-semibold text-black hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>Sign Up</button
				>
				<a
					href="/auth/login"
					class="flex w-1/2 justify-center rounded-md bg-primary px-3 py-1.5 text-sm leading-6 font-semibold text-black hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>Login</a
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
