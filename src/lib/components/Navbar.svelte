<script lang="ts">
  import { resolve } from "$app/paths";
  import IconHome from '~icons/lets-icons/home-duotone';
  import IconChart from '~icons/lets-icons/chart-duotone';
  import IconMap from '~icons/lets-icons/map-duotone';
  import Logo from './Logo.svelte';
</script>

<nav class="navbar">
  <a href={resolve("/")}>
    <h1>
      <Logo />
      Madison Tax Explorer
    </h1>
  </a>
  <div class="spacer"></div>
  <a href={resolve("/")} class="nav-link"><IconHome />Home</a>
  <a href={resolve("/charts")} class="nav-link"><IconChart />Charts</a>
  <a href={resolve("/map")} class="nav-link"><IconMap />Map</a>
</nav>

<style>
  .navbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--color-lower-nav);
    font-family: var(--font-main), "serif";
  }

  h1 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .spacer {
    flex-grow: 1;
  }

  .navbar h1 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.25rem;
  }

  .navbar a {
    text-decoration: none;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    color: var(--color-main-nav);
    background-color: var(--color-link);
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #dcdcdc;
    }
  }
</style>

