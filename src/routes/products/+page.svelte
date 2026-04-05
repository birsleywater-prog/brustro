<script lang="ts">
    import type { PageData } from "./$types";
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { cart } from "$lib/stores/cart";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { env } from "$env/dynamic/public";

    export let data: PageData;

    $: activeCategory = $page.url.searchParams.get("category");
    $: filteredProducts = activeCategory
        ? data.products.filter((p) => {
              const cat = data.categories.find((c) => c.id === p.categoryId);
              return cat?.slug === activeCategory;
          })
        : data.products;

    function filterByCategory(slug: string | null) {
        if (slug) goto(`/products?category=${slug}`);
        else goto("/products");
    }

    function addToCart(product: any) {
        cart.addItem({
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price ?? 0,
            volume: product.volume,
        });
    }
</script>

<SEOHead
    title="Products | {env.PUBLIC_APP_NAME} Water"
    description="Browse {env.PUBLIC_APP_NAME}'s complete range of packaged drinking water — 250ml bottles to 20L jars. Fassai certified. Bulk orders welcome."
    url="/products"
    keywords="packaged water products, 250ml bottle, 500ml bottle, 20 litre jar, bulk water order, {env.PUBLIC_APP_NAME}"
/>

<div class="pt-4 pb-20">
    <!-- Page header -->
    <div class="bg-gradient-to-br from-brand-50 to-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p
                class="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-3"
            >
                Our Range
            </p>
            <h1 class="section-heading mb-4">All Products</h1>
            <p class="section-subheading mx-auto">
                From portable 250ml bottles to 20L bulk jars — find the right
                size for every need.
            </p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <!-- Category filter pills -->
        <div class="flex flex-wrap gap-2 mb-10">
            <button
                class="px-5 py-2 rounded-full text-sm font-medium transition-all"
                class:bg-brand-500={!activeCategory}
                class:text-white={!activeCategory}
                class:bg-gray-100={activeCategory}
                class:text-gray-600={activeCategory}
                on:click={() => filterByCategory(null)}
            >
                All
            </button>
            {#each data.categories as cat}
                <button
                    class="px-5 py-2 rounded-full text-sm font-medium transition-all"
                    class:bg-brand-500={activeCategory === cat.slug}
                    class:text-white={activeCategory === cat.slug}
                    class:bg-gray-100={activeCategory !== cat.slug}
                    class:text-gray-600={activeCategory !== cat.slug}
                    on:click={() => filterByCategory(cat.slug)}
                >
                    {cat.name}
                </button>
            {/each}
        </div>

        <!-- Products masonry grid -->
        {#if filteredProducts.length === 0}
            <div class="text-center py-20 text-gray-400">
                No products found.
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filteredProducts as product}
                    <div class="card group">
                        <a
                            href="/products/{product.slug}"
                            class="block relative h-56 overflow-hidden"
                        >
                            {#if product.image}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    class="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                />
                            {:else}
                                <div
                                    class="w-full h-full bg-gradient-to-br from-water-light to-brand-100 flex items-center justify-center"
                                >
                                    <div class="text-center">
                                        <div class="text-5xl mb-2">💧</div>
                                        <div
                                            class="text-brand-700 font-bold text-lg"
                                        >
                                            {product.volume}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                            {#if product.isFeatured}
                                <span
                                    class="absolute top-3 left-3 bg-brand-500 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                                >
                                    Featured
                                </span>
                            {/if}
                        </a>
                        <div class="p-6">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <span
                                        class="text-xs font-medium text-brand-500 uppercase tracking-wider"
                                        >{product.volume}</span
                                    >
                                    <h2
                                        class="font-heading font-bold text-gray-900 mt-0.5"
                                    >
                                        {product.name}
                                    </h2>
                                </div>
                                {#if product.price}
                                    <span
                                        class="text-lg font-bold text-gray-900"
                                        >₹{product.price}</span
                                    >
                                {/if}
                            </div>
                            <p class="text-sm text-gray-500 line-clamp-2 mb-4">
                                {product.description ?? ""}
                            </p>
                            <div class="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="/products/{product.slug}"
                                    class="border border-brand-200 text-brand-600 hover:bg-brand-50 rounded-lg py-2.5 px-4 text-sm font-semibold flex-1 text-center transition-colors"
                                >
                                    Details
                                </a>
                                <button
                                    on:click={() => addToCart(product)}
                                    class="bg-brand-500 hover:bg-brand-600 text-white rounded-lg py-2.5 px-4 text-sm font-semibold flex-1 text-center transition-colors"
                                >
                                    + Enquire
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
