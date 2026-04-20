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
    placeholder="2 E Mifflin St, Madison, WI 53703"
    bind:value={address}
    onkeydown={(e) => e.key === 'Enter' && submit()}
/>

<style>
    input[type='text'] {
        width: 100%;
        box-sizing: border-box;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        font-family: inherit;
        color: var(--color-text);
        background-color: var(--color-main-nav);
        border: none;
        border-radius: 8px;
        outline: none;
    }

    input[type='text']::placeholder {
        color: rgba(249, 249, 249, 0.35);
    }

    input[type='text']:focus {
        box-shadow: 0 0 0 1px rgba(167, 198, 237, 0.4);
    }
</style>
