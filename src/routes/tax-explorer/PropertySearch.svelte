<script lang="ts">
    import { searchAddresses } from '$lib/api';

    interface Props {
        onsearch: (address: string) => void;
    }

    let { onsearch }: Props = $props();

    let address = $state('');
    let suggestions = $state<string[]>([]);
    let activeIndex = $state(-1);
    let open = $state(false);
    let debounceTimer: ReturnType<typeof setTimeout>;

    function submit(value: string = address) {
        const trimmed = value.trim();
        if (!trimmed) return;
        address = trimmed;
        suggestions = [];
        open = false;
        activeIndex = -1;
        onsearch(trimmed);
    }

    function onInput() {
        clearTimeout(debounceTimer);
        activeIndex = -1;

        if (address.length < 2) {
            suggestions = [];
            open = false;
            return;
        }

        debounceTimer = setTimeout(async () => {
            suggestions = await searchAddresses(address);
            open = suggestions.length > 0;
        }, 250);
    }

    function onKeydown(e: KeyboardEvent) {
        if (!open) {
            if (e.key === 'Enter') submit();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, suggestions.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0) {
                submit(suggestions[activeIndex]);
            } else {
                submit();
            }
        } else if (e.key === 'Escape') {
            open = false;
            activeIndex = -1;
        }
    }

    function onBlur() {
        // Delay so click on suggestion registers first
        setTimeout(() => {
            open = false;
            activeIndex = -1;
        }, 150);
    }
</script>

<div class="search-wrap">
    <input
        id="address"
        type="text"
        placeholder="2 E Mifflin St, Madison, WI 53703"
        autocomplete="off"
        bind:value={address}
        oninput={onInput}
        onkeydown={onKeydown}
        onblur={onBlur}
    />
    {#if open}
        <ul class="suggestions" role="listbox">
            {#each suggestions as suggestion, i}
                <li
                    role="option"
                    aria-selected={i === activeIndex}
                    class:active={i === activeIndex}
                    onmousedown={() => submit(suggestion)}
                >
                    {suggestion}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .search-wrap {
        position: relative;
        width: 100%;
    }

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

    .suggestions {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: var(--color-lower-nav);
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        list-style: none;
        margin: 0;
        padding: 4px;
        z-index: 100;
    }

    li {
        padding: 0.55rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 6px;
        cursor: pointer;
        color: var(--color-link);
        transition: background 0.1s, color 0.1s;
    }

    li:hover,
    li.active {
        background: rgba(255, 255, 255, 0.08);
        color: var(--color-text);
    }
</style>
