<script lang="ts">
    interface AssessmentsData {
        landValue: string | null;
        improvementValue: string | null;
        totalAssessedValue: string | null;
        netTaxes: string | null;
        lotSize: string | null;
    }

    interface Props {
        data: AssessmentsData | null;
    }

    let { data }: Props = $props();
</script>

<div class="table-card">
    <h3>Assessments Table</h3>
    <table>
        <thead>
            <tr><th>Metric</th><th>Value</th></tr>
        </thead>
        <tbody>
            <tr><td>Land Value</td><td>{data?.landValue ?? '-'}</td></tr>
            <tr><td>Improvement Value</td><td>{data?.improvementValue ?? '-'}</td></tr>
            <tr><td>Total Assessed Value</td><td>{data?.totalAssessedValue ?? '-'}</td></tr>
            <tr><td>Net Taxes</td><td>{data?.netTaxes ?? '-'}</td></tr>
            <tr><td>Lot Size</td><td>{data?.lotSize ?? '-'}</td></tr>
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
