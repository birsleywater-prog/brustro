<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME } = env;
    export let form: ActionData;
    let submitting = false;
</script>

<svelte:head>
    <title>Admin Login | {PUBLIC_APP_NAME} Water</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div
        class="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
        <div class="text-center mb-8">
            <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-4 text-3xl"
            >
                💧
            </div>
            <h1 class="font-heading font-extrabold text-2xl text-gray-900">
                Admin Portal
            </h1>
            <p class="text-gray-500 text-sm">
                Please sign in to manage your website
            </p>
        </div>

        {#if form?.error}
            <div
                class="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            >
                {form.error}
            </div>
        {/if}

        <form
            method="POST"
            use:enhance={() => {
                submitting = true;
                return async ({ update }) => {
                    submitting = false;
                    await update();
                };
            }}
            class="space-y-5"
        >
            <div>
                <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 mb-1.5"
                    >Admin Password</label
                >
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                class="btn-primary w-full py-3.5 text-base justify-center"
            >
                {submitting ? "Authenticating..." : "Sign In"}
            </button>
        </form>

        <div class="mt-8 text-center">
            <a
                href="/"
                class="text-sm text-gray-400 hover:text-brand-500 transition-colors"
                >← Back to Website</a
            >
        </div>
    </div>
</div>
