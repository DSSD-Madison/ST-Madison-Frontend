<script lang="ts">
    import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
    import ExpandDown from '~icons/lets-icons/expand-down';

    interface PropertyDetails {
        propertyClass: string;
        propertyUse: string;
        yearBuilt: number | null;
        bedrooms: number | null;
        fullBaths: number | null;
        halfBaths: number | null;
        totalLivingArea: string | null;
        homeStyle: string | null;
        multiStory: boolean | null;
    }

    interface Props {
        data: PropertyDetails | null;
    }

    let { data }: Props = $props();

    let open = $state(false);
    let reference = $state<HTMLElement | undefined>();
    let floating = $state<HTMLElement | undefined>();

    $effect(() => {
        if (!open || !reference || !floating) return;

        const cleanup = autoUpdate(reference, floating, () => {
            if (window.innerWidth <= 768) {
                floating!.style.width = `${reference!.offsetWidth}px`;
            } else {
                floating!.style.width = '';
            }
            computePosition(reference!, floating!, {
                placement: 'bottom-end',
                middleware: [offset(4), flip(), shift({ padding: 8 })]
            }).then(({ x, y }) => {
                Object.assign(floating!.style, {
                    left: `${x}px`,
                    top: `${y}px`
                });
            });
        });

        return cleanup;
    });

    function onWindowClick(e: MouseEvent) {
        if (!reference?.contains(e.target as Node) && !floating?.contains(e.target as Node)) {
            open = false;
        }
    }

    const rows = $derived(
        data == null
            ? []
            : [
                  { label: 'Property Class', value: data.propertyClass },
                  { label: 'Property Use', value: data.propertyUse },
                  { label: 'Year Built', value: data.yearBuilt ?? '-' },
                  { label: 'Bedrooms', value: data.bedrooms ?? '-' },
                  { label: 'Full Baths', value: data.fullBaths ?? '-' },
                  { label: 'Half Baths', value: data.halfBaths ?? '-' },
                  { label: 'Total Living Area', value: data.totalLivingArea ?? '-' },
                  { label: 'Home Style', value: data.homeStyle ?? '-' },
                  {
                      label: 'Multi Story',
                      value: data.multiStory == null ? '-' : data.multiStory ? 'Yes' : 'No'
                  }
              ]
    );
</script>

<svelte:window onclick={onWindowClick} />

<button bind:this={reference} class="dropdown-btn" onclick={() => (open = !open)}>
    Property Details
    <ExpandDown class="icon {open ? 'rotated' : ''}" />
</button>

{#if open}
    <ul bind:this={floating} class="dropdown-menu" role="listbox">
        {#if rows.length === 0}
            <li class="empty">Search for a property to see details.</li>
        {:else}
            {#each rows as row}
                <li>
                    <span class="key">{row.label}</span>
                    <span class="val">{row.value}</span>
                </li>
            {/each}
        {/if}
    </ul>
{/if}

<style>
    .dropdown-btn {
        padding: 0.6rem 1rem;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--color-text);
        font-family: inherit;
        font-size: 0.875rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.4rem;
        width: 100%;
        white-space: nowrap;
        transition: background 0.15s;
    }

    .dropdown-btn:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .dropdown-btn :global(svg) {
        transition: transform 0.3s ease;
    }

    .dropdown-btn :global(.rotated) {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: fixed;
        background: var(--color-lower-nav);
        border-radius: 8px;
        padding: 4px;
        margin: 0;
        list-style: none;
        z-index: 100;
        min-width: 280px;
        box-sizing: border-box;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    li {
        display: flex;
        justify-content: space-between;
        padding: 0.4rem 0.75rem;
        font-size: 0.85rem;
        border-radius: 6px;
    }

    .empty {
        padding: 0.4rem 0.75rem;
        font-size: 0.85rem;
        color: var(--color-link);
        font-style: italic;
    }

    .key {
        color: var(--color-link);
    }

    .val {
        color: var(--color-text);
        font-weight: 500;
    }
</style>
