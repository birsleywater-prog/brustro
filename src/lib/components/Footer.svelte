<script lang="ts">
  import { env } from "$env/dynamic/public";
  const {
    PUBLIC_FACEBOOK_URL,
    PUBLIC_INSTAGRAM_URL,
    PUBLIC_YOUTUBE_URL,
    PUBLIC_PHONE_DISPLAY,
    PUBLIC_PHONE_LINK,
    PUBLIC_CONTACT_EMAIL,
    PUBLIC_APP_NAME,
    PUBLIC_PLANT_ADDRESS,
    PUBLIC_MAP_EMBED_URL,
    PUBLIC_MAP_REDIRECT_URL,
  } = env;
</script>

<footer class="bg-gray-950 text-gray-300">
  <!-- Main footer content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <!-- Brand column -->
      <div class="lg:col-span-1">
        <div class="mb-4">
          <span
            class="font-heading font-extrabold text-2xl tracking-widest text-white uppercase"
            >{PUBLIC_APP_NAME || "Birsley"}</span
          >
          <span
            class="block text-[10px] tracking-[0.3em] text-gray-500 uppercase font-medium mt-0.5"
            >Packaged Drinking Water</span
          >
        </div>
        <p class="text-sm text-gray-400 leading-relaxed mb-6">
          West Bengal's first automated water plant. Premium packaged drinking
          water with strict quality control and 12+ years of industry
          experience.
        </p>
        <!-- Social links -->
        <div class="flex items-center gap-3">
          {#if PUBLIC_FACEBOOK_URL}
            <a
              href={PUBLIC_FACEBOOK_URL}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
              class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"
                ><path
                  d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                /></svg
              >
            </a>
          {/if}
          {#if PUBLIC_INSTAGRAM_URL}
            <a
              href={PUBLIC_INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          {/if}
          {#if PUBLIC_YOUTUBE_URL}
            <a
              href={PUBLIC_YOUTUBE_URL}
              target="_blank"
              rel="noopener"
              aria-label="YouTube"
              class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"
                ></path>
                <polygon
                  points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                  fill="white"
                ></polygon>
              </svg>
            </a>
          {/if}
        </div>
      </div>

      <!-- Quick links -->
      <div>
        <h4
          class="text-white font-semibold mb-5 text-sm uppercase tracking-widest"
        >
          Quick Links
        </h4>
        <ul class="space-y-3">
          {#each [["/", "Home"], ["/about", "About Us"], ["/products", "Products"], ["/categories", "Categories"], ["/blog", "Blog"]] as [href, label]}
            <li>
              <a
                {href}
                class="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                >{label}</a
              >
            </li>
          {/each}
        </ul>
      </div>

      <!-- Products -->
      <div>
        <h4
          class="text-white font-semibold mb-5 text-sm uppercase tracking-widest"
        >
          Products
        </h4>
        <ul class="space-y-3">
          {#each [["250ml Bottle", "250ml-bottle"], ["500ml Bottle", "500ml-bottle"], ["1 Litre Bottle", "1-litre-bottle"], ["2 Litre Bottle", "2-litre-bottle"], ["5 Litre Jar", "5-litre-jar"], ["20 Litre Jar", "20-litre-jar"]] as [name, slug]}
            <li>
              <a
                href="/products/{slug}"
                class="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                >{name}</a
              >
            </li>
          {/each}
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4
          class="text-white font-semibold mb-5 text-sm uppercase tracking-widest"
        >
          Contact
        </h4>
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <svg
              class="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <a
              href={PUBLIC_PHONE_LINK}
              class="text-sm text-gray-400 hover:text-brand-400 transition-colors"
              >{PUBLIC_PHONE_DISPLAY}</a
            >
          </li>
          <li class="flex items-start gap-3">
            <svg
              class="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a
              href="mailto:{PUBLIC_CONTACT_EMAIL}"
              class="text-sm text-gray-400 hover:text-brand-400 transition-colors"
              >{PUBLIC_CONTACT_EMAIL}</a
            >
          </li>
          {#if PUBLIC_PLANT_ADDRESS}
            <li class="flex items-start gap-3">
              <a
                href={PUBLIC_MAP_REDIRECT_URL || PUBLIC_MAP_EMBED_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-0.5 flex-shrink-0 text-brand-400 hover:text-brand-300 transition-colors"
                title="View on Google Maps"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
              <a
                href={PUBLIC_MAP_REDIRECT_URL || PUBLIC_MAP_EMBED_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-gray-400 leading-relaxed hover:text-brand-400 transition-colors"
              >
                {PUBLIC_PLANT_ADDRESS}
              </a>
            </li>
          {/if}
        </ul>

        <!-- Newsletter -->
        <div class="mt-6">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-3">
            Subscribe to newsletter
          </p>
          <form class="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              class="flex-1 bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg hover:bg-brand-600 transition-colors font-medium"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-gray-800">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3"
    >
      <p class="text-xs text-gray-500">
        &copy; {new Date().getFullYear()}
        {PUBLIC_APP_NAME} Water. All rights reserved.
      </p>
      <div class="flex items-center gap-6">
        <a
          href="/privacy-policy"
          class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >Privacy Policy</a
        >
        <a
          href="/terms"
          class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >Terms of Use</a
        >
        <a
          href="/sitemap.xml"
          class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >Sitemap</a
        >
      </div>
    </div>
  </div>
</footer>
