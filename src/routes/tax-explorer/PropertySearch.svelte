<script lang="ts">
    import SendHor from '~icons/lets-icons/send-hor-duotone';
    interface Props {
        onsearch: (address: string) => void;
    }

    let { onsearch }: Props = $props();

    let address = $state('');

    function submit() {
        if (address.trim()) onsearch(address.trim());
    }
</script>

<div class="search">
    <input
        id="address"
        type="text"
        placeholder="Enter Address"
        bind:value={address}
        onkeydown={(e) => e.key === 'Enter' && submit()}
    />
    <button onclick={() => submit()}><SendHor class="send-icon" /></button>
</div>

<style>
    .search {
        display: flex;
        max-width: 340px;
        border: 1.5px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        outline-width: 0;
    }

    .search:focus-within {
        border-color: var(--color-link);

        & button {
            border-color: var(--color-link);
        }
    }

    button {
        cursor: pointer;
        outline: none;
        display: flex;
        border-left: 1.5px solid rgba(255, 255, 255, 0.2);
        border-right: none;
        border-bottom: none;
        border-top: none;
        width: fit-content;
        align-items: center;
        background-color: transparent;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        transition: all 0.3s;

        :global(.send-icon) {
            color: rgba(249, 249, 249, 0.5);
            width: 2rem;
            height: 2rem;
            transition: all 0.1s;

            &:hover {
                color: var(--color-link);
                transition: all 0.1s;
                transform: scale(1.25);
            }

            &:active {
                transform: translateX(6px) scale(1.25);
            }
        }
    }

    input[type='text'] {
        flex: 1;
        max-width: 340px;
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
        font-family: inherit;
        color: var(--color-text);
        outline: none;
        border: none;
        background: none;
    }
</style>
