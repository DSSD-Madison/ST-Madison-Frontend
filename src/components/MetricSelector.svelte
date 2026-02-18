<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { ChevronDown } from '@lucide/svelte';
  import { selectedMetric, METRIC_OPTIONS, type Metric } from '../stores/mapState.js';
  let currentMetric = $derived(
    METRIC_OPTIONS.find((o) => o.value === $selectedMetric) ?? METRIC_OPTIONS[0]
  );

  function select(value: Metric) {
    selectedMetric.set(value);
  }
</script>

<div class="absolute top-4 left-4 z-10">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class="flex items-center gap-2 rounded-md bg-gray-900/90 px-3 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-white/10 backdrop-blur-sm hover:bg-gray-800/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      {currentMetric.label}
      <ChevronDown class="h-4 w-4 opacity-60" />
    </DropdownMenu.Trigger>

    <DropdownMenu.Content
      class="z-20 min-w-[200px] rounded-md bg-gray-900 p-1 shadow-xl ring-1 ring-white/10"
      align="start"
    >
      {#each METRIC_OPTIONS as option (option.value)}
        <DropdownMenu.Item
          class="flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-white outline-none transition-colors hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10"
          onclick={() => select(option.value)}
        >
          {option.label}
          {#if option.value === $selectedMetric}
            <span class="ml-auto h-1.5 w-1.5 rounded-full bg-white"></span>
          {/if}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
