<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import IconMap from '~icons/lets-icons/map-duotone';
  import Logo from './Logo.svelte';

  const links = [
    { href: '/tax-explorer', label: 'Tax Explorer' },
    { href: '/map', label: 'Map', icon: IconMap },
    { href: '/statistics', label: 'Statistics' },
  ];
</script>

<nav class="navbar">
  <div class="navbar-left">
    <a href={resolve("/")} class="brand">
      <Logo />
      <span>Madison Tax Explorer</span>
    </a>
    <div class="links">
      {#each links as link}
        <a
          href={resolve(link.href as Parameters<typeof resolve>[0])}
          class="nav-link"
          class:active={page.url.pathname === link.href}
        >
          {link.label}
        </a>
      {/each}
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 64px;
    background-color: var(--color-lower-nav);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-text);
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  .links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-link {
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-link);
    padding-bottom: 2px;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
  }

  .nav-link:hover {
    color: var(--color-yellow);
  }

  .nav-link.active {
    color: var(--color-yellow);
    border-bottom-color: var(--color-yellow);
  }
</style>
