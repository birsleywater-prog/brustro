<script lang="ts">
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { cart, cartTotal } from "$lib/stores/cart";
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME } = env;
    export let form: ActionData;

    let submitting = false;
</script>

<SEOHead
    title="Checkout | {PUBLIC_APP_NAME} Water"
    description="Complete your {PUBLIC_APP_NAME} water order enquiry."
    url="/checkout"
/>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
    <h1 class="font-heading font-extrabold text-3xl text-gray-900 mb-8">
        Checkout
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Order details form -->
        <div>
            <h2 class="font-heading font-semibold text-xl text-gray-900 mb-6">
                Delivery Details
            </h2>
            {#if form?.error}
                <div
                    class="p-4 mb-5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
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
                <!-- Hidden cart data -->
                <input
                    type="hidden"
                    name="items"
                    value={JSON.stringify($cart)}
                />
                <input type="hidden" name="total" value={$cartTotal} />

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                            for="co-name">Full Name *</label
                        >
                        <input
                            id="co-name"
                            name="name"
                            required
                            placeholder="Your name"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                            for="co-email">Email *</label
                        >
                        <input
                            id="co-email"
                            name="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                            for="co-phone">Phone</label
                        >
                        <input
                            id="co-phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors"
                        />
                    </div>
                    <div class="col-span-2">
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                            for="co-address">Delivery Address</label
                        >
                        <textarea
                            id="co-address"
                            name="address"
                            rows="3"
                            placeholder="Full delivery address..."
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors resize-none"
                        ></textarea>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={submitting || $cart.length === 0}
                    class="btn-primary w-full py-4 text-base justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "Submitting..." : "Submit Order Enquiry"}
                </button>
                <p class="text-xs text-gray-400 text-center">
                    Our team will confirm the order and payment details within
                    24 hours.
                </p>
            </form>
        </div>

        <!-- Order summary -->
        <div>
            <h2 class="font-heading font-semibold text-xl text-gray-900 mb-6">
                Order Summary
            </h2>
            <div class="bg-gray-50 rounded-2xl p-6 space-y-4">
                {#if $cart.length === 0}
                    <p class="text-gray-400 text-sm text-center py-4">
                        No items in cart. <a
                            href="/products"
                            class="text-brand-500 hover:underline"
                            >Browse Products</a
                        >
                    </p>
                {:else}
                    {#each $cart as item}
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0 text-lg"
                            >
                                💧
                            </div>
                            <div class="flex-1 text-sm">
                                <div class="font-medium text-gray-900">
                                    {item.name}
                                </div>
                                <div class="text-gray-500">
                                    x{item.quantity}
                                </div>
                            </div>
                            <div class="font-semibold text-gray-900 text-sm">
                                ₹{(item.price * item.quantity).toFixed(0)}
                            </div>
                        </div>
                    {/each}
                    <div
                        class="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900"
                    >
                        <span>Total</span>
                        <span>₹{$cartTotal.toFixed(0)}</span>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
