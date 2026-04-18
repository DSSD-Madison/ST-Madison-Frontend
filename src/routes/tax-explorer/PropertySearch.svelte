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
        border: 1.5px solid #333;
        border-radius: 6px;
        outline-width: 0;
    }

    .search:focus-within {
        border-color: cornflowerblue;

        & button {
            border-color: cornflowerblue;
        }
    }

    button {
        cursor: pointer;
        outline: none;
        display: flex;
        border-left: 1.5px solid #333;
        border-right: none;
        border-bottom: none;
        border-top: none;
        width: fit-content;
        align-items: center;
        background-color: whitesmoke;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        transition: all 0.3s;

        :global(.send-icon) {
            color: gray;
            width: 2rem;
            height: 2rem;
            transition: all 0.1s;

            &:hover {
                color: royalblue;
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
        outline: none;
        border: none;
        background: none;
    }
</style>
