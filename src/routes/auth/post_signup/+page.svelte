<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<body>
	<p>
		Please check your email for a verification link, it will expire in 15 minutes. Please wait
		up to 10 minutes to resend a code.
	</p>
</body>
