<script lang="ts">
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { env } from "$env/dynamic/public";
    const {
        PUBLIC_PHONE_DISPLAY,
        PUBLIC_PHONE_LINK,
        PUBLIC_CONTACT_EMAIL,
        PUBLIC_MAP_EMBED_URL,
        PUBLIC_APP_NAME,
        PUBLIC_PLANT_NAME,
        PUBLIC_PLANT_ADDRESS,
        PUBLIC_MAP_REDIRECT_URL
    } = env;

    export let form: ActionData;

    let submitting = false;
</script>

<SEOHead
    title="Contact Us | {PUBLIC_APP_NAME} Water"
    description="Contact {PUBLIC_APP_NAME} Water for bulk orders, enquiries, or distributor partnerships. Call {PUBLIC_PHONE_DISPLAY} or mail {PUBLIC_CONTACT_EMAIL}."
    url="/contact"
/>

<div class="pb-20">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-brand-50 to-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="section-heading mb-4">Get In Touch</h1>
            <p class="section-subheading mx-auto">
                Book an appointment, share your requirements, or ask us
                anything.
            </p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Contact info -->
            <div class="space-y-8">
                <div>
                    <h2
                        class="font-heading font-bold text-2xl text-gray-900 mb-6"
                    >
                        Contact Information
                    </h2>
                    <div class="space-y-6">
                        <div class="flex gap-4 items-start">
                            <a
                                href={PUBLIC_PHONE_LINK}
                                class="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 hover:bg-brand-100 transition-colors group"
                                title="Call Us"
                            >
                                <svg
                                    class="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </a>
                            <div>
                                <div class="font-semibold text-gray-900 mb-0.5">
                                    Call Us
                                </div>
                                <a
                                    href={PUBLIC_PHONE_LINK}
                                    class="text-brand-600 hover:underline"
                                    >{PUBLIC_PHONE_DISPLAY}</a
                                >
                            </div>
                        </div>
                        <div class="flex gap-4 items-start">
                            <a
                                href="mailto:{PUBLIC_CONTACT_EMAIL}"
                                class="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 hover:bg-brand-100 transition-colors group"
                                title="Mail Us"
                            >
                                <svg
                                    class="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </a>
                            <div>
                                <div class="font-semibold text-gray-900 mb-0.5">
                                    Mail Us
                                </div>
                                <a
                                    href="mailto:{PUBLIC_CONTACT_EMAIL}"
                                    class="text-brand-600 hover:underline"
                                    >{PUBLIC_CONTACT_EMAIL}</a
                                >
                            </div>
                        </div>

                        {#if PUBLIC_PLANT_ADDRESS}
                            <div class="flex gap-4 items-start pt-2">
                                <a
                                    href={PUBLIC_MAP_REDIRECT_URL || PUBLIC_MAP_EMBED_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 hover:bg-brand-100 transition-colors group"
                                    title="View on Google Maps"
                                >
                                    <svg
                                        class="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </a>
                                <div>
                                    <div
                                        class="font-semibold text-gray-900 mb-0.5"
                                    >
                                        Visit the Plant
                                    </div>
                                    <div class="text-gray-600 space-y-0.5">
                                        {#if PUBLIC_PLANT_NAME}
                                            <p class="font-medium">
                                                {PUBLIC_PLANT_NAME}
                                            </p>
                                        {/if}
                                        <a
                                            href={PUBLIC_MAP_REDIRECT_URL || PUBLIC_MAP_EMBED_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-sm leading-relaxed hover:text-brand-600 transition-colors"
                                        >
                                            {PUBLIC_PLANT_ADDRESS}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Process steps mini -->
                <div class="bg-gray-50 rounded-2xl p-6">
                    <h3 class="font-heading font-semibold text-gray-900 mb-4">
                        How to Order
                    </h3>
                    <ol class="space-y-3">
                        {#each ["Share your water requirements", "Receive a tailored quote", "Make payment", "Fast delivery to your door"] as step, i}
                            <li
                                class="flex items-center gap-3 text-sm text-gray-600"
                            >
                                <span
                                    class="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    >{i + 1}</span
                                >
                                {step}
                            </li>
                        {/each}
                    </ol>
                </div>
            </div>

            <!-- Contact form -->
            <div
                class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10"
            >
                <h2 class="font-heading font-bold text-xl text-gray-900 mb-6">
                    Send a Message
                </h2>

                {#if form?.success}
                    <div
                        class="p-5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-6"
                    >
                        ✓ Thank you! We'll get back to you shortly.
                    </div>
                {/if}
                {#if form?.error}
                    <div
                        class="p-5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6"
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
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                            for="name">Full Name *</label
                        >
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Your full name"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                            for="email">Email *</label
                        >
                        <input
                            id="email"
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
                            for="phone">Phone</label
                        >
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1.5"
                            for="message">Message / Requirements *</label
                        >
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows="5"
                            placeholder="Tell us your water requirements, quantity needed, delivery location..."
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors resize-none"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        class="btn-primary w-full py-3.5 text-base justify-center"
                    >
                        {submitting ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </div>

        <!-- Map Section -->
        <div class="mt-20">
            <div
                class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-2 lg:p-3"
            >
                <div
                    class="aspect-[16/9] md:aspect-[21/9] lg:aspect-[32/9] min-h-[400px] w-full rounded-[1.5rem] overflow-hidden"
                >
                    <iframe
                        title="Our Location"
                        src={PUBLIC_MAP_EMBED_URL}
                        width="100%"
                        height="100%"
                        style="border:0;"
                        allowfullscreen={true}
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        class="grayscale hover:grayscale-0 transition-all duration-700"
                    ></iframe>
                </div>
            </div>
        </div>
    </div>
</div>
