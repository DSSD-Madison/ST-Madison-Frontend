<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    import Navbar from '$lib/components/Navbar.svelte';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children()}

<style>
    :global(body) {
        margin: 0;
        font-family: system-ui, sans-serif;
    }
</style>
