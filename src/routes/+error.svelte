<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME } = env;

    // Animation trigger
    let mounted = false;
    onMount(() => {
        mounted = true;
    });

    $: is404 = $page.status === 404;
    $: errorTitle = is404 ? "Page Evaporated" : "Purification System Ripple";
    $: errorMessage = is404
        ? "The page you are looking for has evaporated into thin air. Let's get you back to pure hydration."
        : "Our internal purification system encountered a ripple. We're working on stabilizing the flow.";
</script>

<svelte:head>
    <title>{$page.status} - {errorTitle} | {PUBLIC_APP_NAME}</title
    >
</svelte:head>

<div
    class="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-hero-gradient overflow-hidden relative"
>
    <!-- Decorative Water Bubbles/Shapes -->
    <div
        class="absolute top-1/4 -left-10 w-64 h-64 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
    ></div>
    <div
        class="absolute bottom-1/4 -right-10 w-64 h-64 bg-cyan-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style="animation-delay: 1s"
    ></div>

    <div class="max-w-xl w-full text-center relative z-10">
        <div class="mb-8 aos visible">
            <span
                class="text-9xl font-extrabold text-transparent bg-clip-text bg-water-gradient opacity-20 block leading-none select-none"
            >
                {$page.status}
            </span>
        </div>

        <div class="space-y-6">
            <h1
                class="text-4xl md:text-5xl font-extrastrong text-gray-900 font-heading"
            >
                {errorTitle}
            </h1>

            <p class="text-lg text-gray-500 leading-relaxed max-w-md mx-auto">
                {errorMessage}
            </p>

            <div
                class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
                <a href="/" class="btn-primary w-full sm:w-auto px-8">
                    Back to Flow (Home)
                </a>
                <a href="/contact" class="btn-outline w-full sm:w-auto px-8">
                    Report an Issue
                </a>
            </div>
        </div>

        {#if !is404 && $page.error?.message}
            <div
                class="mt-12 p-4 bg-red-50 rounded-xl border border-red-100 text-left"
            >
                <p
                    class="text-xs uppercase font-bold text-red-400 mb-1 tracking-wider"
                >
                    Troubleshooting Detail
                </p>
                <p class="text-sm text-red-600 font-mono">
                    {$page.error.message}
                </p>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Ensure the AOS animations work even if the observer hasn't caught them yet */
    .aos.visible {
        opacity: 1;
        transform: translateY(0);
    }
</style>
