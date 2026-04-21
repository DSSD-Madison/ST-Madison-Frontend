<script lang="ts">
    type Props = {
        x: number;
        y: number;
        visible: boolean;
        address: string | null;
        metricLabel: string | null;
        metricValue: string | null;
        propertyUse: string | null;
    };

    let { x, y, visible, address, metricLabel, metricValue, propertyUse }: Props = $props();
</script>

{#if visible}
    <div class="tooltip" style="left: {x + 14}px; top: {y - 8}px;">
        {#if address}
            <div class="address">{address}</div>
        {/if}
        {#if propertyUse}
            <div class="row">
                <span class="key">Use</span>
                <span class="val">{propertyUse}</span>
            </div>
        {/if}
        {#if metricLabel}
            <div class="row">
                <span class="key">{metricLabel}</span>
                <span class="val">{metricValue ?? '—'}</span>
            </div>
        {/if}
    </div>
{/if}

<style>
    .tooltip {
        position: fixed;
        z-index: 200;
        pointer-events: none;
        background: var(--color-lower-nav);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
        min-width: 180px;
        max-width: 260px;
    }

    .address {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: 0.35rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.78rem;
        padding: 0.1rem 0;
    }

    .key {
        color: var(--color-link);
        white-space: nowrap;
    }

    .val {
        color: var(--color-text);
        font-weight: 500;
        text-align: right;
    }
</style>
