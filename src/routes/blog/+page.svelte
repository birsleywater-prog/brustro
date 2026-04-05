<script lang="ts">
    import type { PageData } from "./$types";
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME } = env;
    export let data: PageData;
</script>

<SEOHead
    title="Blog | {PUBLIC_APP_NAME} Water"
    description="Read the latest articles on hydration, water quality, and health tips from {PUBLIC_APP_NAME} Water."
    url="/blog"
/>

<div class="pb-20">
    <div class="bg-gradient-to-br from-brand-50 to-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="section-heading mb-4">News &amp; Articles</h1>
            <p class="section-subheading mx-auto">
                Insights on hydration, water quality, and healthy living.
            </p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {#if data.posts.length === 0}
            <div class="text-center py-20 text-gray-400">
                No articles yet. Check back soon!
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {#each data.posts as post, i}
                    <a
                        href="/blog/{post.slug}"
                        class="card group aos"
                        style="transition-delay: {i * 80}ms"
                    >
                        <div
                            class="h-52 bg-gradient-to-br from-brand-50 to-water-light flex items-center justify-center overflow-hidden"
                        >
                            {#if post.image}
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            {:else}
                                <span class="text-5xl">📰</span>
                            {/if}
                        </div>
                        <div class="p-6">
                            <p class="text-xs text-gray-400 mb-2">
                                {post.publishedAt
                                    ? new Date(
                                          post.publishedAt,
                                      ).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : ""}
                            </p>
                            <h2
                                class="font-heading font-bold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors"
                            >
                                {post.title}
                            </h2>
                            <p class="text-sm text-gray-500 line-clamp-3">
                                {post.excerpt ?? ""}
                            </p>
                            <span
                                class="inline-block mt-4 text-sm text-brand-500 font-medium"
                                >Read Article →</span
                            >
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</div>
