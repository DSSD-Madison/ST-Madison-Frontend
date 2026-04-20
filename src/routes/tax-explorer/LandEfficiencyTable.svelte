<script lang="ts">
    interface LandEfficiencyData {
        landValuePerSqft: string | null;
        netTaxesPerSqft: string | null;
        landShareOfProperty: string | null;
        landValueAlignmentIndex: string | null;
    }

    interface Props {
        data: LandEfficiencyData | null;
    }

    let { data }: Props = $props();

    const rows = $derived([
        { label: 'Land Value per Sqft', value: data?.landValuePerSqft },
        { label: 'Net Taxes per Sqft', value: data?.netTaxesPerSqft },
        { label: 'Land Share of Property', value: data?.landShareOfProperty },
        { label: 'Land Value Alignment Index', value: data?.landValueAlignmentIndex },
    ]);
</script>

<div class="card">
    <h2>Land Efficiency</h2>
    <div class="rows">
        {#each rows as row}
            <div class="row">
                <span class="row-label">{row.label}</span>
                <span class="row-value">{row.value ?? '-'}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .card {
        background-color: var(--color-lower-nav);
        border-radius: 12px;
        padding: 1.75rem 2rem;
    }

    h2 {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0 0 1.25rem;
    }

    .rows {
        display: flex;
        flex-direction: column;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    .row:last-child {
        border-bottom: none;
    }

    .row-label {
        font-size: 0.875rem;
        color: rgba(249, 249, 249, 0.55);
    }

    .row-value {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-link);
    }
</style>
