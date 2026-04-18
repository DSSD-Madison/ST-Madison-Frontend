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
</script>

<div class="table-card">
    <h3>Land Efficiency Table</h3>
    <table>
        <thead>
            <tr><th>Metric</th><th>Value</th></tr>
        </thead>
        <tbody>
            <tr><td>Land Value per Sqft</td><td>{data?.landValuePerSqft ?? '-'}</td></tr>
            <tr><td>Net Taxes per Sqft</td><td>{data?.netTaxesPerSqft ?? '-'}</td></tr>
            <tr><td>Land Share of Property</td><td>{data?.landShareOfProperty ?? '-'}</td></tr>
            <tr
                ><td>Land Value Alignment Index</td><td>{data?.landValueAlignmentIndex ?? '-'}</td
                ></tr
            >
        </tbody>
    </table>
</div>

<style>
    .table-card {
        border: 1.5px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 0.75rem 1rem;
    }

    h3 {
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: rgba(249, 249, 249, 0.55);
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.85rem;
    }

    th {
        text-align: left;
        font-weight: 600;
        padding: 0.25rem 0.5rem 0.4rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(249, 249, 249, 0.7);
    }

    td {
        padding: 0.3rem 0.5rem;
        color: var(--color-text);
    }

    td:last-child {
        text-align: right;
        color: rgba(249, 249, 249, 0.65);
    }

    tr:not(:last-child) td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }
</style>
