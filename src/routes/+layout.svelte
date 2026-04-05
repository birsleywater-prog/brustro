<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { afterNavigate } from "$app/navigation";
  import { onMount, tick } from "svelte";

  let observer: IntersectionObserver;

  function initObserver() {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    const elements = document.querySelectorAll(".aos, .aos-left");
    elements.forEach((el) => observer.observe(el));
  }

  onMount(() => {
    initObserver();
    return () => observer?.disconnect();
  });

  afterNavigate(async () => {
    await tick();
    initObserver();
  });
</script>

<div class="min-h-screen flex flex-col">
  <Navbar />
  <main class="flex-1 pt-16 md:pt-20">
    <slot />
  </main>
  <Footer />
</div>
