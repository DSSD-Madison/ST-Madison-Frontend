<script lang="ts">
    export type GroupByKey =
        | 'none'
        | 'alder_district_name'
        | 'area_plan_name'
        | 'ward'
        | 'property_class'
        | 'property_use'
        | 'zoning_all';

    const OPTIONS: { key: GroupByKey; label: string }[] = [
        { key: 'none', label: 'None' },
        { key: 'alder_district_name', label: 'Alder District' },
        { key: 'area_plan_name', label: 'Area Plan' },
        { key: 'ward', label: 'Ward' },
        { key: 'property_class', label: 'Property Class' },
        { key: 'property_use', label: 'Property Use' },
        { key: 'zoning_all', label: 'Zoning' },
    ];

    type Props = {
        active: GroupByKey;
        onchange: (key: GroupByKey) => void;
    };

    let { active, onchange }: Props = $props();
</script>

<div class="chip-row">
    <span class="chip-label">Group by</span>
    {#each OPTIONS as opt (opt.key)}
        <button
            type="button"
            class="chip"
            class:active={opt.key === active}
            onclick={() => onchange(opt.key)}
        >
            {opt.label}
        </button>
    {/each}
</div>

<style>
    .chip-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
    }

    .chip-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-link);
        margin-right: 2px;
    }

    .chip {
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.07);
        color: var(--color-text);
        font-size: 0.8rem;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.12s, border-color 0.12s, color 0.12s;
        white-space: nowrap;
    }

    .chip:hover {
        background: rgba(255, 255, 255, 0.14);
    }

    .chip.active {
        background: var(--color-yellow);
        border-color: var(--color-yellow);
        color: var(--color-main-nav);
        font-weight: 600;
    }
</style>
