<script lang="ts">
    import Map from '$lib/components/Map.svelte';
    import { PUBLIC_TILE_ADDRESS } from '$env/static/public';
</script>

<Map tileAddress={PUBLIC_TILE_ADDRESS || null} />
