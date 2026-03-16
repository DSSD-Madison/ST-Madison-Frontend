<script lang="ts">
  import { resolve } from "$app/paths";
  import Icon from '@iconify/svelte'; 
</script>

<nav class="navbar">
  <a href={resolve("/")}><h1>Strong Towns Tax Explorer</h1></a>
  <div class="spacer"></div>
  <a href={resolve("/")} class="nav-link"><Icon icon="lets-icons:home-duotone" />Home</a>
  <a href={resolve("/charts")} class="nav-link"><Icon icon="lets-icons:chart-duotone" />Charts</a>
  <a href={resolve("/map")} class="nav-link"><Icon icon="lets-icons:map-duotone" />Map</a>
</nav>

<style>
  .navbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--color-lower-nav);
  }

  .spacer {
    flex-grow: 1;
  }

  .navbar h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  .navbar a {
    text-decoration: none;
    color: var(--color-lower-nav);
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    background-color: var(--color-link);
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #dcdcdc;
    }
  }
</style>
