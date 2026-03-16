<script lang="ts">
  import { resolve } from "$app/paths";
  import IconHome from '~icons/lets-icons/home-duotone';
  import IconChart from '~icons/lets-icons/chart-duotone';
  import IconMap from '~icons/lets-icons/map-duotone';
</script>

<nav class="navbar">
  <a href={resolve("/")}><h1>Strong Towns Tax Explorer</h1></a>
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
    background-color: #f5f5f5;
    border-bottom: #ccc solid 1px;
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
    color: #333;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    background-color: #ececec;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #dcdcdc;
    }
  }
</style>
