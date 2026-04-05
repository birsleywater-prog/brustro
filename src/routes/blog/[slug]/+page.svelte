<script lang="ts">
    import type { PageData } from "./$types";
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { buildBlogJsonLd } from "$lib/utils/seo";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME } = env;
    export let data: PageData;
    $: post = data.post;
</script>

<SEOHead
    title="{post.title} | {PUBLIC_APP_NAME} Water Blog"
    description={post.excerpt ?? ""}
    url="/blog/{post.slug}"
    type="article"
    jsonLd={buildBlogJsonLd(post)}
/>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-400 mb-8 flex items-center gap-2">
        <a href="/" class="hover:text-brand-500 transition-colors">Home</a>
        <span>/</span>
        <a href="/blog" class="hover:text-brand-500 transition-colors">Blog</a>
        <span>/</span>
        <span class="text-gray-700 line-clamp-1">{post.title}</span>
    </nav>

    <!-- Post header -->
    <div class="mb-10">
        <p class="text-xs text-gray-400 mb-4">
            {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                  })
                : ""}
        </p>
        <h1
            class="font-heading font-extrabold text-3xl md:text-4xl text-gray-900 leading-tight mb-6"
        >
            {post.title}
        </h1>
        {#if post.excerpt}
            <p
                class="text-lg text-gray-500 leading-relaxed border-l-4 border-brand-300 pl-5"
            >
                {post.excerpt}
            </p>
        {/if}
    </div>

    {#if post.image}
        <div class="mb-10 rounded-2xl overflow-hidden">
            <img
                src={post.image}
                alt={post.title}
                class="w-full h-64 object-cover"
            />
        </div>
    {/if}

    <!-- Post content -->
    <div
        class="prose prose-lg max-w-none prose-headings:font-heading prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline"
    >
        {@html post.content ?? "<p>Content coming soon.</p>"}
    </div>

    <!-- Back link -->
    <div class="mt-12 pt-8 border-t border-gray-100">
        <a href="/blog" class="btn-outline text-sm">← Back to All Articles</a>
    </div>
</div>
