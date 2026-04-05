<script lang="ts">
  import { page } from "$app/stores";
  import { cartCount } from "$lib/stores/cart";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  const { PUBLIC_APP_NAME } = env;

  let scrolled = false;
  let mobileOpen = false;
  let highlightCart = false;
  let lastCount = $cartCount;

  $: if ($cartCount > lastCount) {
    highlightCart = true;
    setTimeout(() => (highlightCart = false), 1000);
    lastCount = $cartCount;
  } else {
    lastCount = $cartCount;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function toggleMobile() {
    mobileOpen = !mobileOpen;
  }
  function closeMobile() {
    mobileOpen = false;
  }

  $: currentPath = $page.url.pathname;
</script>

<header
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-brand-50"
  class:shadow-sm={scrolled}
>
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">
      <!-- Left nav links (desktop) -->
      <div class="hidden lg:flex items-center gap-6">
        {#each navLinks.slice(0, 3) as link}
          <a
            href={link.href}
            class="text-sm font-medium transition-colors duration-200"
            class:text-brand-600={currentPath === link.href}
            class:text-gray-700={currentPath !== link.href}
            on:click={closeMobile}
          >
            {link.label}
          </a>
        {/each}
      </div>

      <!-- Brand name center -->
      <a
        href="/"
        class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span
          class="font-heading font-extrabold text-2xl tracking-widest text-brand-600 uppercase"
        >
          {PUBLIC_APP_NAME}
        </span>
        <span
          class="text-[9px] tracking-[0.3em] text-gray-400 uppercase font-medium"
          >Water</span
        >
      </a>

      <!-- Right nav links + cart (desktop) -->
      <div class="hidden lg:flex items-center gap-6">
        {#each navLinks.slice(3) as link}
          <a
            href={link.href}
            class="text-sm font-medium transition-colors duration-200"
            class:text-brand-600={currentPath === link.href}
            class:text-gray-700={currentPath !== link.href}
          >
            {link.label}
          </a>
        {/each}

        <!-- Cart icon -->
        <a
          href="/cart"
          class="relative p-2 text-gray-700 hover:text-brand-600 transition-all duration-300 {highlightCart
            ? 'scale-125 text-brand-500'
            : ''}"
          aria-label="Cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {#if $cartCount > 0}
            <span
              class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center transition-transform duration-300 {highlightCart
                ? 'scale-125'
                : ''}"
            >
              {$cartCount}
            </span>
          {/if}
        </a>

        <a href="/contact" class="btn-primary text-sm px-5 py-2">Enquire Now</a>
      </div>

      <!-- Mobile right: cart + hamburger -->
      <div class="flex lg:hidden items-center gap-3 ml-auto">
        <a
          href="/cart"
          class="relative p-2 text-gray-700 transition-all duration-300 {highlightCart
            ? 'scale-125 text-brand-500'
            : ''}"
          aria-label="Cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {#if $cartCount > 0}
            <span
              class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center transition-transform duration-300 {highlightCart
                ? 'scale-125'
                : ''}"
            >
              {$cartCount}
            </span>
          {/if}
        </a>
        <button
          on:click={toggleMobile}
          class="p-2 text-gray-700 hover:text-brand-600"
          aria-label="Menu"
        >
          {#if mobileOpen}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile menu -->
  {#if mobileOpen}
    <div class="lg:hidden bg-brand-50 border-t border-gray-100 shadow-lg">
      <div class="px-4 py-4 space-y-1">
        {#each navLinks as link}
          <a
            href={link.href}
            class="block px-4 py-3 text-sm font-medium rounded-xl transition-colors"
            class:bg-brand-50={currentPath === link.href}
            class:text-brand-600={currentPath === link.href}
            class:text-gray-700={currentPath !== link.href}
            on:click={closeMobile}
          >
            {link.label}
          </a>
        {/each}
        <div class="pt-3 border-t border-gray-100">
          <a
            href="/contact"
            class="btn-primary w-full text-center text-sm"
            on:click={closeMobile}
          >
            Enquire Now
          </a>
        </div>
      </div>
    </div>
  {/if}
</header>
