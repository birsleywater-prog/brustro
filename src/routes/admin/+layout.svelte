<script lang="ts">
    import { page } from "$app/stores";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME } = env;
    import { afterNavigate } from "$app/navigation";

    let mobileMenuOpen = false;

    afterNavigate(() => {
        mobileMenuOpen = false;
    });
</script>

<div class="min-h-screen bg-gray-50 flex relative">
    {#if $page.url.pathname !== "/admin/login"}
        <!-- Sidebar Backdrop (Mobile) -->
        {#if mobileMenuOpen}
            <button
                type="button"
                class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                on:click={() => (mobileMenuOpen = false)}
                aria-label="Close menu"
            ></button>
        {/if}

        <!-- Admin Sidebar -->
        <aside
            class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static {mobileMenuOpen
                ? 'translate-x-0 shadow-2xl'
                : '-translate-x-full'}"
        >
            <div class="p-6 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">💧</span>
                    <span
                        class="font-heading font-bold text-xl tracking-tight text-gray-900"
                        >{PUBLIC_APP_NAME} Admin</span
                    >
                </div>
                <!-- Close Button (Mobile Only) -->
                <button
                    on:click={() => (mobileMenuOpen = false)}
                    class="p-2 -mr-2 text-gray-400 hover:text-gray-900 md:hidden"
                    aria-label="Close menu"
                >
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <nav class="flex-1 px-4 space-y-1 mt-4">
                {#each [{ label: "Dashboard", path: "/admin", icon: "📊" }, { label: "About Page", path: "/admin/about", icon: "ℹ️" }, { label: "Products", path: "/admin/products", icon: "🛒" }, { label: "Categories", path: "/admin/categories", icon: "📁" }, { label: "Banners", path: "/admin/banners", icon: "🖼️" }, { label: "Blog Posts", path: "/admin/blog", icon: "📰" }, { label: "Reviews", path: "/admin/reviews", icon: "⭐" }, { label: "Orders", path: "/admin/orders", icon: "📦" }, { label: "Contact Leads", path: "/admin/contacts", icon: "✉️" }] as item}
                    <a
                        href={item.path}
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors {$page
                            .url.pathname === item.path
                            ? 'bg-brand-50 text-brand-600'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </a>
                {/each}
            </nav>

            <div class="p-4 border-t border-gray-50">
                <form action="/admin/logout" method="POST">
                    <button
                        type="submit"
                        class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </form>
            </div>
        </aside>
    {/if}

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
        {#if $page.url.pathname !== "/admin/login"}
            <!-- Header -->
            <header
                class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0"
            >
                <div class="flex items-center gap-4">
                    <button
                        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
                        class="p-2 -ml-2 text-gray-500 hover:text-gray-900 md:hidden"
                        aria-label="Toggle Menu"
                    >
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <h2 class="font-heading font-bold text-gray-900 truncate">
                        Manage {$page.url.pathname
                            .split("/")
                            .pop()
                            ?.split("-")
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                            )
                            .join(" ") || "Dashboard"}
                    </h2>
                </div>
                <div class="flex items-center gap-3 md:gap-4">
                    <div class="text-right hidden sm:block">
                        <div class="text-xs font-semibold text-gray-900">
                            Administrator
                        </div>
                        <div class="text-[10px] text-gray-400">Online</div>
                    </div>
                    <div
                        class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 shrink-0"
                    >
                        A
                    </div>
                </div>
            </header>
        {/if}

        <main
            class="flex-1 overflow-y-auto {$page.url.pathname === '/admin/login'
                ? ''
                : 'p-4 md:p-8'}"
        >
            <slot />
        </main>
    </div>
</div>
