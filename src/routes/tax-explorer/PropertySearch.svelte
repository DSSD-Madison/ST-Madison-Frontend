<script lang="ts">
    interface Props {
        onsearch: (address: string) => void;
    }

    let { onsearch }: Props = $props();

    let open = $state(false);
    let address = $state('');

    function submit() {
        if (address.trim()) onsearch(address.trim());
    }
</script>

<div class="search-section">
    <label for="address">Find a Property</label>
    <div class="search-row">
        <input
            id="address"
            type="text"
            placeholder="Enter Address"
            bind:value={address}
            onkeydown={(e) => e.key === 'Enter' && submit()}
        />
        <div class="dropdown-wrapper">
            <button class="dropdown-btn" onclick={() => (open = !open)}>
                Property Details <span class="caret">&#8964;</span>
            </button>
            {#if open}
                <ul class="dropdown-menu">
                    <li>Property Class</li>
                    <li>Property Use</li>
                    <li>Year Built</li>
                    <li>Bedrooms</li>
                    <li>Full Baths</li>
                    <li>Half Baths</li>
                    <li>Total Living Area</li>
                    <li>Home Style</li>
                    <li>Multi Story</li>
                </ul>
            {/if}
        </div>
    </div>
</div>

<style>
    .search-section {
        margin-bottom: 1.75rem;
    }

    label {
        display: block;
        font-size: 0.85rem;
        color: #555;
        margin-bottom: 0.4rem;
    }

    .search-row {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
    }

    input[type='text'] {
        flex: 1;
        max-width: 340px;
        padding: 0.45rem 0.75rem;
        border: 1.5px solid #333;
        border-radius: 6px;
        font-size: 0.9rem;
        font-family: inherit;
        outline: none;
    }

    input[type='text']:focus {
        border-color: #666;
    }

    .dropdown-wrapper {
        position: relative;
    }

    .dropdown-btn {
        padding: 0.45rem 0.75rem;
        border: 1.5px solid #333;
        border-radius: 6px;
        background: #fff;
        font-family: inherit;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .dropdown-btn:hover {
        background: #f5f5f5;
    }

    .caret {
        font-size: 1rem;
        line-height: 1;
    }

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
        min-width: 180px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .dropdown-menu li {
        padding: 0.35rem 1rem;
        font-size: 0.85rem;
        cursor: pointer;
    }

    .dropdown-menu li:hover {
        background: #f5f5f5;
    }
</style>
