<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import Navbar from '$lib/components/Navbar.svelte';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="app-container">
    <Navbar />
    <main class="content">
        {@render children()}
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family: system-ui, sans-serif;
    }

    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content {
        flex: 1;
        overflow: auto;
    }
</style>
