<script lang="ts">
    interface PropertyDetails {
        propertyClass: string;
        propertyUse: string;
        yearBuilt: number;
        bedrooms: number;
        fullBaths: number;
        halfBaths: number;
        totalLivingArea: string;
        homeStyle: string;
        multiStory: boolean;
    }

    interface Props {
        open: boolean;
        data: PropertyDetails | null;
    }

    let { open, data }: Props = $props();
</script>

{#if open}
    <ul class="dropdown-menu">
        <li>
            <span class="key">Property Class</span><span class="val"
                >{data?.propertyClass ?? '-'}</span
            >
        </li>
        <li>
            <span class="key">Property Use</span><span class="val">{data?.propertyUse ?? '-'}</span>
        </li>
        <li>
            <span class="key">Year Built</span><span class="val">{data?.yearBuilt ?? '-'}</span>
        </li>
        <li><span class="key">Bedrooms</span><span class="val">{data?.bedrooms ?? '-'}</span></li>
        <li>
            <span class="key">Full Baths</span><span class="val">{data?.fullBaths ?? '-'}</span>
        </li>
        <li>
            <span class="key">Half Baths</span><span class="val">{data?.halfBaths ?? '-'}</span>
        </li>
        <li>
            <span class="key">Total Living Area</span><span class="val"
                >{data?.totalLivingArea ?? '-'}</span
            >
        </li>
        <li>
            <span class="key">Home Style</span><span class="val">{data?.homeStyle ?? '-'}</span>
        </li>
        <li>
            <span class="key">Multi Story</span><span class="val"
                >{data == null ? '-' : data.multiStory ? 'Yes' : 'No'}</span
            >
        </li>
    </ul>
{/if}

<style>
    .dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        background: #fff;
        border: 1.5px solid #333;
        border-radius: 6px;
        padding: 0.25rem 0;
        margin: 0;
        list-style: none;
        z-index: 10;
        min-width: 280px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    li {
        display: flex;
        justify-content: space-between;
        padding: 0.35rem 1rem;
        font-size: 0.85rem;
    }

    .key {
        color: #555;
    }

    .val {
        color: #222;
        font-weight: 500;
    }
</style>
