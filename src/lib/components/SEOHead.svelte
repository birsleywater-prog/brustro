<script lang="ts">
  import { env } from "$env/dynamic/public";
  const { PUBLIC_APP_NAME, PUBLIC_SITE_URL } = env;

  export let title: string;
  export let description: string;
  export let image = "/images/og-default.jpg";
  export let url = "";
  export let type: "website" | "article" | "product" = "website";
  export let jsonLd: object | null = null;
  export let keywords = "";

  const siteUrl = PUBLIC_SITE_URL || "https://birsley.in";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywords}<meta name="keywords" content={keywords} />{/if}
  <link rel="canonical" href={fullUrl} />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={fullImage} />
  <meta property="og:url" content={fullUrl} />
  <meta
    property="og:site_name"
    content="{PUBLIC_APP_NAME}"
  />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={fullImage} />

  <!-- JSON-LD -->
  {#if jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
  {/if}
</svelte:head>
