<script lang="ts">
    import type { PageData } from "./$types";
    import SEOHead from "$lib/components/SEOHead.svelte";
    import { organizationJsonLd } from "$lib/utils/seo";
    import { cart } from "$lib/stores/cart";
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { env } from "$env/dynamic/public";
    const {
        PUBLIC_PHONE_DISPLAY,
        PUBLIC_PHONE_LINK,
        PUBLIC_APP_NAME,
    } = env;

    export let data: PageData;

    let showSuccessModal = false;
    let currentBanner = 0;
    let bannerInterval: ReturnType<typeof setInterval>;
    let currentTestimonial = 0;
    let testimonialContainer: HTMLElement;

    onMount(() => {
        if ($page.url.searchParams.get("ordered") === "1") {
            showSuccessModal = true;
            cart.clearCart();
        }

        if (data.banners.length > 1) {
            bannerInterval = setInterval(() => {
                currentBanner = (currentBanner + 1) % data.banners.length;
            }, 5000);
        }
        return () => clearInterval(bannerInterval);
    });

    function closeSuccessModal() {
        showSuccessModal = false;
        const url = new URL($page.url);
        url.searchParams.delete("ordered");
        goto(url.pathname, { replaceState: true, noScroll: true });
    }

    function handleTestimonialScroll(e: Event) {
        const target = e.target as HTMLElement;
        const scrollLeft = target.scrollLeft;
        if (target.children.length > 0) {
            const itemWidth = target.children[0].clientWidth;
            currentTestimonial = Math.round(scrollLeft / (itemWidth + 24)); // 24px gap
        }
    }

    function scrollToTestimonial(i: number) {
        if (testimonialContainer && testimonialContainer.children.length > 0) {
            const itemWidth = testimonialContainer.children[0].clientWidth;
            testimonialContainer.scrollTo({
                left: i * (itemWidth + 24),
                behavior: 'smooth'
            });
            currentTestimonial = i;
        }
    }

    const features = [
        {
            icon: "🏅",
            title: "Finest Quality",
            desc: "Strict quality control guarantees each bottle is delightful and safe.",
        },
        {
            icon: "🏭",
            title: "Automated Factory",
            desc: "West Bengal's first automated plant. Cutting-edge technology maximizes output.",
        },
        {
            icon: "📦",
            title: "Wide Range",
            desc: "Various consumer demands are catered up to 20L jars.",
        },
        {
            icon: "⏰",
            title: "24/7 Working",
            desc: "Round-the-clock operation to meet any requirement, any time.",
        },
    ];

    const processSteps = [
        {
            step: "01",
            title: "Schedule a Call",
            desc: "Get in touch and tell us your requirements.",
        },
        {
            step: "02",
            title: "Share Requirements",
            desc: `Give ${PUBLIC_APP_NAME} your specifications for superior hydration.`,
        },
        {
            step: "03",
            title: "Make the Payment",
            desc: "Pay using any accepted payment method, online or offline.",
        },
        {
            step: "04",
            title: "Get the Delivery",
            desc: "Dependable, timely shipping ensures your order arrives quickly.",
        },
    ];

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
    title="{PUBLIC_APP_NAME} Water — West Bengal's Premium Packaged Drinking Water"
    description="{PUBLIC_APP_NAME} is West Bengal's first automated packaged drinking water plant. Premium quality 250ml to 20L water bottles and jars. Fassai certified. 12+ years of experience."
    url="/"
    jsonLd={organizationJsonLd}
    keywords="packaged drinking water, mineral water, {PUBLIC_APP_NAME} water, West Bengal water plant, 20L jar, water delivery"
/>

<!-- ─── HERO ──────────────────────────────────────────────────────────────── -->
<section
    class="relative min-h-[92vh] flex items-center overflow-hidden bg-gray-50"
>
    {#each data.banners as banner, i}
        <div
            class="transition-all duration-1000 absolute inset-0 flex items-center"
            style="opacity: {i === currentBanner
                ? 1
                : 0}; pointer-events: {i === currentBanner ? 'auto' : 'none'};"
        >
            <!-- Background Layer -->
            <div class="absolute inset-0 z-0">
                {#if banner.backgroundImage}
                    <img
                        src={banner.backgroundImage}
                        alt=""
                        class="w-full h-full object-cover"
                    />
                    <div
                        class="absolute inset-0 bg-white/60 backdrop-blur-[2px]"
                    ></div>
                {:else}
                    <div
                        class="w-full h-full bg-hero-gradient opacity-40"
                    ></div>
                {/if}

                <!-- Decorative Circles -->
                <div
                    class="absolute top-20 right-10 w-72 h-72 bg-water-light rounded-full opacity-30 blur-3xl"
                ></div>
                <div
                    class="absolute bottom-10 left-10 w-56 h-56 bg-brand-100 rounded-full opacity-20 blur-2xl"
                ></div>
            </div>

            <div
                class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 relative z-10"
            >
                <div
                    class="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20"
                >
                    <div
                        class="max-w-2xl {banner.image
                            ? ''
                            : 'lg:col-span-2 mx-auto text-center'}"
                    >
                        <div
                            class="inline-block px-4 py-1.5 bg-brand-50 text-brand-600 text-xs font-semibold tracking-widest uppercase rounded-full mb-6 border border-brand-100"
                        >
                            ✦ Pure. Safe. Refreshing.
                        </div>
                        <h1
                            class="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-[1.1] mb-6 text-balance"
                        >
                            {banner.title}
                        </h1>
                        <p
                            class="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed {banner.image
                                ? ''
                                : 'mx-auto'}"
                        >
                            {banner.subtitle}
                        </p>
                        <div
                            class="flex flex-wrap gap-4 {banner.image
                                ? ''
                                : 'justify-center'}"
                        >
                            {#if banner.ctaText && banner.ctaLink}
                                <a
                                    href={banner.ctaLink}
                                    class="btn-primary text-base px-8 py-4"
                                >
                                    {banner.ctaText}
                                </a>
                            {/if}
                            <a
                                href="/products"
                                class="btn-outline text-base px-8 py-4"
                            >
                                View Products
                            </a>
                        </div>

                        <!-- Stats row -->
                        <div
                            class="flex flex-wrap gap-10 mt-14 {banner.image
                                ? ''
                                : 'justify-center'}"
                        >
                            {#each [["12+", "Years Experience"], ["6+", "Product Variants"], ["Fassai", "Certified"]] as [num, label]}
                                <div>
                                    <div
                                        class="text-3xl font-extrabold font-heading text-brand-600"
                                    >
                                        {num}
                                    </div>
                                    <div class="text-sm text-gray-500 mt-0.5">
                                        {label}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>

                    {#if banner.image}
                        <div
                            class="hidden lg:flex relative group mt-10 lg:mt-0 max-w-sm mx-auto lg:max-w-none justify-center"
                        >
                            <div class="relative z-10 animate-float">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    class="w-auto h-auto max-h-[300px] lg:max-h-[450px] object-contain drop-shadow-2xl rounded-3xl"
                                />
                            </div>
                            <!-- Background glow for image -->
                            <div
                                class="absolute inset-0 bg-brand-400/20 blur-[100px] rounded-full scale-75 -z-0"
                            ></div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/each}

    <!-- Overlay Dots Navigation (Fixed relative to section) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {#if data.banners.length > 1}
            <div
                class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20"
            >
                {#each data.banners as _, i}
                    <button
                        aria-label="View banner {i + 1}"
                        class="w-2 h-2 rounded-full transition-all duration-300"
                        class:bg-brand-500={i === currentBanner}
                        class:bg-gray-300={i !== currentBanner}
                        class:w-6={i === currentBanner}
                        on:click={() => (currentBanner = i)}
                    ></button>
                {/each}
            </div>
        {/if}
    </div>
</section>

<!-- ─── FEATURES ─────────────────────────────────────────────────────────── -->
<section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14 aos">
            <h2 class="section-heading">Why Choose {PUBLIC_APP_NAME}?</h2>
            <p class="section-subheading mx-auto">
                We Provide The Best Packaged Drinking Water — backed by
                technology, quality, and experience.
            </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each features as f, i}
                <div
                    class="aos p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 group"
                    style="transition-delay: {i * 100}ms"
                >
                    <div class="text-4xl mb-4">{f.icon}</div>
                    <h3
                        class="font-heading font-bold text-lg text-gray-900 mb-2"
                    >
                        {f.title}
                    </h3>
                    <p class="text-sm text-gray-500 leading-relaxed">
                        {f.desc}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- ─── PRODUCTS ───────────────────────────────────────────────────────────── -->
<section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
            <div class="aos">
                <p
                    class="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-2"
                >
                    Our Product Line
                </p>
                <h2 class="section-heading">Pure Water, Every Size</h2>
            </div>
            <a
                href="/products"
                class="hidden md:inline-flex btn-outline text-sm"
                >View All Products →</a
            >
        </div>

        <!-- Product grid (masonry-style with varied aspect ratios) -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {#each data.featuredProducts as product, i}
                <div
                    class="product-card aos rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                    style="transition-delay: {i * 80}ms"
                >
                    <!-- Image placeholder with gradient background -->
                    <a
                        href="/products/{product.slug}"
                        class="block relative overflow-hidden h-64"
                    >
                        {#if product.image}
                            <img
                                src={product.image}
                                alt={product.name}
                                class="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                            />
                        {:else}
                            <div
                                class="w-full h-full bg-gradient-to-br from-water-light via-brand-100 to-brand-200 flex items-center justify-center"
                            >
                                <div class="text-center">
                                    <div class="text-6xl mb-2">💧</div>
                                    <div
                                        class="text-brand-700 font-bold text-xl"
                                    >
                                        {product.volume}
                                    </div>
                                </div>
                            </div>
                        {/if}
                        <!-- Overlay on hover -->
                        <div
                            class="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-all duration-300"
                        ></div>
                    </a>

                    <div class="p-5">
                        <div class="flex items-start justify-between">
                            <div>
                                <span
                                    class="text-xs font-medium text-brand-500 uppercase tracking-wider"
                                    >{product.volume}</span
                                >
                                <h3
                                    class="font-heading font-bold text-gray-900 mt-1"
                                >
                                    {product.name}
                                </h3>
                                <p
                                    class="text-sm text-gray-500 mt-1 line-clamp-2"
                                >
                                    {product.description ?? ""}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4 flex flex-col xl:flex-row items-center gap-3">
                            <button
                                on:click={() => addToCart(product)}
                                class="w-full xl:w-auto xl:ml-auto text-xs bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 py-2 font-semibold transition-colors order-1 xl:order-2"
                            >
                                Enquire
                            </button>
                            <a
                                href="/products/{product.slug}"
                                class="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors order-2 xl:order-1"
                            >
                                Details →
                            </a>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="text-center mt-8 md:hidden">
            <a href="/products" class="btn-outline">View All Products →</a>
        </div>
    </div>
</section>

<!-- ─── LICENSING & CERTIFICATIONS ────────────────────────────────────────── -->
<section class="py-20 bg-gray-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14 aos">
            <p
                class="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-2"
            >
                Trust & Quality
            </p>
            <h2 class="section-heading">Licensing & Certifications</h2>
            <p class="section-subheading mx-auto">
                Our commitment to quality is backed by the highest industry standards and certifications.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {#each [
                {
                    icon: "🏢",
                    title: "GST Number",
                    subtitle: "19AASFK2716K1ZT",
                    desc: "Officially registered under the GST system of India, ensuring transparent and legal business operations.",
                },
                {
                    icon: "🛡️",
                    title: "FSSAI Licensed",
                    subtitle: "12823999000337",
                    desc: "Fully licensed by the Food Safety and Standards Authority of India (License No. <b>12823999000337</b>), ensuring absolute hygiene and health standards.",
                },
                {
                    icon: "⚙️",
                    title: "Automated Plant",
                    subtitle: "Technology",
                    desc: "Operating West Bengal's first fully automated plant with 24/7 quality monitoring and zero manual handling.",
                }
            ] as cert, i}
                <div
                    class="aos bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-100 transition-all duration-300 group"
                    style="transition-delay: {i * 100}ms"
                >
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                            {cert.icon}
                        </div>
                        <div>
                            <div class="text-xs font-bold text-brand-500 uppercase tracking-wider">{cert.subtitle}</div>
                            <h3 class="font-heading font-extrabold text-gray-900 text-xl">{cert.title}</h3>
                        </div>
                    </div>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        {@html cert.desc}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- ─── PROCESS ────────────────────────────────────────────────────────────── -->
<section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14 aos">
            <p
                class="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-2"
            >
                How We Work
            </p>
            <h2 class="section-heading">
                Enjoy An Easy &amp; Hassle-Free Ordering Process
            </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {#each processSteps as step, i}
                <div
                    class="aos relative group"
                    style="transition-delay: {i * 100}ms"
                >
                    <!-- Connector line -->
                    {#if i < processSteps.length - 2}
                        <div
                            class="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-200 to-transparent z-0 -translate-y-px"
                        ></div>
                    {/if}
                    <div class="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
                        <div
                            class="w-16 h-16 rounded-2xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center mb-5 group-hover:bg-brand-500 group-hover:border-brand-500 transition-all duration-300"
                        >
                            <span
                                class="font-heading font-extrabold text-brand-600 text-xl group-hover:text-white transition-colors"
                                >{step.step}</span
                            >
                        </div>
                        <h3 class="font-heading font-bold text-gray-900 mb-2">
                            {step.title}
                        </h3>
                        <p class="text-sm text-gray-500 leading-relaxed">
                            {step.desc}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
        <div class="text-center mt-12">
            <a href="/contact" class="btn-primary px-10 py-4 text-base"
                >Order Now</a
            >
        </div>
    </div>
</section>

<!-- ─── TESTIMONIALS ──────────────────────────────────────────────────────── -->
{#if data.testimonials.length > 0}
    <section class="py-20 bg-gradient-to-br from-brand-900 to-brand-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-14 aos">
                <p
                    class="text-xs font-semibold tracking-widest text-brand-200 uppercase mb-2"
                >
                    Testimonials
                </p>
                <h2
                    class="text-3xl md:text-4xl font-extrabold font-heading text-white"
                >
                    What Distributors Say About Us
                </h2>
            </div>
            <div 
                bind:this={testimonialContainer}
                on:scroll={handleTestimonialScroll}
                class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth hide-scrollbar {data.testimonials.length <= 3 ? 'md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0' : ''}"
            >
                {#each data.testimonials as t, i}
                    <div
                        class="aos shrink-0 w-[85vw] sm:w-[60vw] md:w-[350px] snap-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 {data.testimonials.length <= 3 ? 'md:w-auto' : ''}"
                        style="transition-delay: {i * 100}ms"
                    >
                        <!-- Stars -->
                        <div class="flex gap-1 mb-4">
                            {#each Array(t.rating ?? 5) as _}
                                <span class="text-yellow-400">★</span>
                            {/each}
                        </div>
                        <p class="text-white/90 leading-relaxed mb-6 text-sm">
                            "{t.content}"
                        </p>
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-brand-400 flex items-center justify-center text-white font-bold text-sm"
                            >
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <div class="font-semibold text-white text-sm">
                                    {t.name}
                                </div>
                                <div class="text-brand-200 text-xs">
                                    {t.role}, {t.company}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            
            <!-- Navigation Dots -->
            <div class="flex justify-center gap-2 mt-6 {data.testimonials.length <= 3 ? 'md:hidden' : ''}">
                {#each data.testimonials as _, i}
                    <button
                        aria-label="View testimonial {i + 1}"
                        class="h-2 rounded-full transition-all duration-300 {i === currentTestimonial ? 'w-6 bg-brand-400' : 'w-2 bg-white/30'}"
                        on:click={() => scrollToTestimonial(i)}
                    ></button>
                {/each}
            </div>
        </div>
    </section>
{/if}

<!-- ─── BLOG ───────────────────────────────────────────────────────────────── -->
{#if data.recentPosts.length > 0}
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-end justify-between mb-12">
                <div class="aos">
                    <p
                        class="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-2"
                    >
                        Blog
                    </p>
                    <h2 class="section-heading">Latest News &amp; Articles</h2>
                </div>
                <a
                    href="/blog"
                    class="hidden md:inline-flex btn-outline text-sm"
                    >All Articles →</a
                >
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {#each data.recentPosts as post, i}
                    <a
                        href="/blog/{post.slug}"
                        class="card group aos"
                        style="transition-delay: {i * 100}ms"
                    >
                        <div
                            class="h-48 bg-gradient-to-br from-brand-50 to-water-light flex items-center justify-center overflow-hidden"
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
                            <h3
                                class="font-heading font-bold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors"
                            >
                                {post.title}
                            </h3>
                            <p class="text-sm text-gray-500 line-clamp-2">
                                {post.excerpt ?? ""}
                            </p>
                            <span
                                class="inline-block mt-4 text-sm text-brand-500 font-medium"
                                >Read More →</span
                            >
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </section>
{/if}

<!-- ─── CTA BANNER ─────────────────────────────────────────────────────────── -->
<section class="py-20 bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center aos">
        <p
            class="text-xs font-semibold tracking-widest text-brand-400 uppercase mb-4"
        >
            Get Started Today
        </p>
        <h2
            class="text-3xl md:text-4xl font-extrabold font-heading text-white mb-6"
        >
            Schedule A Call For Exceptional<br class="hidden md:block" /> Packaged
            Drinking Waters
        </h2>
        <p class="text-gray-400 max-w-xl mx-auto mb-10">
            We cater to all types of orders — from single packs to large bulk
            orders. Call us or book an appointment.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
            <a href={PUBLIC_PHONE_LINK} class="btn-primary px-8 py-4 text-base"
                >📞 {PUBLIC_PHONE_DISPLAY}</a
            >
            <a
                href="/contact"
                class="btn-outline text-white border-white/30 hover:bg-white hover:text-gray-900 px-8 py-4 text-base"
                >Book Appointment</a
            >
        </div>
    </div>
</section>

{#if showSuccessModal}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
    >
        <div
            class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl aos"
        >
            <div
                class="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            >
                ✅
            </div>
            <h2 class="text-2xl font-heading font-extrabold text-gray-900 mb-3">
                Request Submitted!
            </h2>
            <p class="text-gray-500 text-sm mb-8 leading-relaxed">
                Thank you for choosing {PUBLIC_APP_NAME}. Your order enquiry has
                been received. Our team will contact you shortly to confirm the
                details.
            </p>
            <button
                on:click={closeSuccessModal}
                class="btn-primary w-full py-4 text-base font-bold rounded-2xl shadow-lg shadow-brand-200"
            >
                Great, Thanks!
            </button>
        </div>
    </div>
{/if}

<style>
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
