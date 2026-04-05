<script lang="ts">
    import type { PageData } from "./$types";
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { buildProductJsonLd } from "$lib/utils/seo";
    import { cart } from "$lib/stores/cart";
    import { env } from "$env/dynamic/public";

    export let data: PageData;
    $: product = data.product;
    $: gallery = (() => {
        try {
            return product.gallery ? JSON.parse(product.gallery) : [];
        } catch {
            return [];
        }
    })();
    $: allImages = product.image ? [product.image, ...gallery] : gallery;
    let activeImage = 0;

    function addToCart() {
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
    title="{product.name} | {env.PUBLIC_APP_NAME} Water"
    description={product.description ??
        `Buy ${env.PUBLIC_APP_NAME} ${product.name} — Fassai certified packaged drinking water.`}
    url="/products/{product.slug}"
    type="product"
    jsonLd={buildProductJsonLd(product)}
/>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-400 mb-8 flex items-center gap-2">
        <a href="/" class="hover:text-brand-500 transition-colors">Home</a>
        <span>/</span>
        <a href="/products" class="hover:text-brand-500 transition-colors"
            >Products</a
        >
        <span>/</span>
        <span class="text-gray-700">{product.name}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <!-- Image gallery -->
        <div>
            <div
                class="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-water-light to-brand-100 mb-4"
            >
                {#if allImages.length > 0}
                    <img
                        src={allImages[activeImage]}
                        alt={product.name}
                        class="w-full h-full object-contain p-8"
                    />
                {:else}
                    <div class="w-full h-full flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-8xl mb-4">💧</div>
                            <div class="text-brand-700 font-bold text-2xl">
                                {product.volume}
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
            {#if allImages.length > 1}
                <div class="flex gap-3">
                    {#each allImages as img, i}
                        <button
                            class="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
                            class:border-brand-500={i === activeImage}
                            class:border-transparent={i !== activeImage}
                            on:click={() => (activeImage = i)}
                        >
                            <img
                                src={img}
                                alt=""
                                class="w-full h-full object-contain p-1"
                            />
                        </button>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Product info -->
        <div class="flex flex-col">
            <div class="mb-2">
                <span
                    class="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-wider rounded-full border border-brand-100"
                >
                    {product.volume}
                </span>
            </div>
            <h1
                class="font-heading font-extrabold text-3xl md:text-4xl text-gray-900 mt-3 mb-4"
            >
                {product.name}
            </h1>
            <p class="text-gray-500 leading-relaxed mb-6">
                {product.description ?? ""}
            </p>

            {#if product.price}
                <div class="text-3xl font-bold text-gray-900 mb-6">
                    ₹{product.price}
                    <span class="text-base font-normal text-gray-400 ml-1"
                        >/ unit</span
                    >
                </div>
            {/if}

            <!-- Stock badge -->
            <div class="flex items-center gap-2 mb-8">
                {#if product.inStock}
                    <span class="w-2 h-2 rounded-full bg-green-500 inline-block"
                    ></span>
                    <span class="text-sm text-green-600 font-medium"
                        >Available for order</span
                    >
                {:else}
                    <span class="w-2 h-2 rounded-full bg-red-400 inline-block"
                    ></span>
                    <span class="text-sm text-red-500 font-medium"
                        >Currently unavailable</span
                    >
                {/if}
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                    on:click={addToCart}
                    class="btn-primary flex-1 py-4 text-base justify-center"
                >
                    + Add to Enquiry List
                </button>
                <a
                    href="/contact"
                    class="btn-outline flex-1 py-4 text-base justify-center"
                >
                    Contact for Bulk Order
                </a>
            </div>

            <!-- Details -->
            {#if product.details}
                <div class="border-t border-gray-100 pt-6">
                    <h3 class="font-heading font-bold text-gray-900 mb-3">
                        Product Details
                    </h3>
                    <div class="prose prose-sm text-gray-500 max-w-none">
                        {@html product.details}
                    </div>
                </div>
            {/if}

            <!-- Features list -->
            <div class="mt-6 grid grid-cols-2 gap-3">
                {#each ["Fassai Certified", "Triple Purification", "Tamper-proof Seal", "Food-grade PET"] as feat}
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <span class="text-brand-500">✓</span>
                        {feat}
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Related products -->
    {#if data.related.length > 0}
        <div class="mt-20">
            <h2 class="section-heading mb-8">Related Products</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each data.related as rel}
                    <a href="/products/{rel.slug}" class="card group">
                        <div
                            class="h-40 bg-gradient-to-br from-water-light to-brand-100 flex items-center justify-center overflow-hidden"
                        >
                            {#if rel.image}
                                <img
                                    src={rel.image}
                                    alt={rel.name}
                                    class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            {:else}
                                <span class="text-4xl">💧</span>
                            {/if}
                        </div>
                        <div class="p-4">
                            <span class="text-xs text-brand-500 font-medium"
                                >{rel.volume}</span
                            >
                            <h3
                                class="font-heading font-semibold text-gray-900 text-sm mt-0.5"
                            >
                                {rel.name}
                            </h3>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    {/if}
</div>
