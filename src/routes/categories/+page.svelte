<script lang="ts">
    import type { PageData } from "./$types";
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME } = env;
    export let data: PageData;
</script>

<SEOHead
    title="Categories | {PUBLIC_APP_NAME} Water"
    description="Browse {PUBLIC_APP_NAME}'s water product categories — bottles and large jars for every need."
    url="/categories"
/>

<div class="pb-20">
    <div class="bg-gradient-to-br from-brand-50 to-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="section-heading mb-4">Product Categories</h1>
            <p class="section-subheading mx-auto">
                Find the perfect packaging size for your hydration needs.
            </p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {#each data.categories as cat}
                <a
                    href="/products?category={cat.slug}"
                    class="card group flex flex-col sm:flex-row overflow-hidden h-auto sm:h-48"
                >
                    <div
                        class="w-full sm:w-48 h-48 sm:h-full bg-gradient-to-br from-water-light to-brand-200 flex items-center justify-center flex-shrink-0"
                    >
                        {#if cat.image}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <span class="text-5xl">💧</span>
                        {/if}
                    </div>
                    <div class="p-6 sm:p-8 flex flex-col justify-center">
                        <h2
                            class="font-heading font-bold text-xl text-gray-900 mb-2 group-hover:text-brand-600 transition-colors"
                        >
                            {cat.name}
                        </h2>
                        <p class="text-sm text-gray-500 leading-relaxed mb-4">
                            {cat.description ?? ""}
                        </p>
                        <span class="text-sm text-brand-500 font-medium"
                            >View Products →</span
                        >
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>
