<script lang="ts">
    import type { NumericMetric } from '$lib/config/metrics';

    type Props = {
        metrics: NumericMetric[];
        activeKey: string;
        onchange: (metric: NumericMetric) => void;
    };

    let { metrics, activeKey, onchange }: Props = $props();
</script>

<div class="chip-row">
    <span class="chip-label">Metric</span>
    {#each metrics as metric (metric.key)}
        <button
            type="button"
            class="chip"
            class:active={metric.key === activeKey}
            onclick={() => onchange(metric)}
        >
            {metric.label}
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
