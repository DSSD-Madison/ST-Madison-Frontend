<script lang="ts">
    interface Props {
        onsearch: (address: string) => void;
    }

    let { onsearch }: Props = $props();

    let address = $state('');

    function submit() {
        if (address.trim()) onsearch(address.trim());
    }
</script>

<input
    id="address"
    type="text"
    placeholder="Enter Address"
    bind:value={address}
    onkeydown={(e) => e.key === 'Enter' && submit()}
/>

<style>
    input[type='text'] {
        flex: 1;
        max-width: 340px;
        padding: 0.45rem 0.75rem;
        border: 1.5px solid #333;
        border-radius: 6px;
        font-size: 0.9rem;
        font-family: inherit;
        outline: none;
    }

    input[type='text']:focus {
        border-color: #666;
    }
</style>
