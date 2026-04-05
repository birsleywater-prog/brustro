<script lang="ts">
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

    export let data: PageData;

    let editing: any = null;
    let showModal = false;
    let uploadingImage = false;
    let uploadingBgImage = false;

    async function handleFileUpload(
        e: Event,
        type: "image" | "backgroundImage",
    ) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        if (type === "image") uploadingImage = true;
        else uploadingBgImage = true;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                editing[type] = result.url;
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            if (type === "image") uploadingImage = false;
            else uploadingBgImage = false;
        }
    }

    async function deleteBanner(id: number) {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        const res = await fetch("/api/banners", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) invalidateAll();
        else alert("Failed to delete banner");
    }

    async function save() {
        const method = editing.id ? "PUT" : "POST";
        const res = await fetch("/api/banners", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editing),
        });
        if (res.ok) {
            showModal = false;
            editing = null;
            invalidateAll();
        } else {
            const err = await res.json();
            alert(err.error || "Failed to save banner");
        }
    }

    function startNew() {
        editing = {
            title: "",
            subtitle: "",
            ctaText: "Enquire Now",
            ctaLink: "/contact",
            image: "",
            backgroundImage: "",
            isActive: true,
            sortOrder: data.banners.length + 1,
        };
        showModal = true;
    }

    function removeImage(type: "image" | "backgroundImage") {
        editing[type] = "";
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-heading font-extrabold text-gray-900">
            Hero Banners
        </h2>
        <button on:click={startNew} class="btn-primary text-sm"
            >Add Banner</button
        >
    </div>

    <div class="grid grid-cols-1 gap-6">
        {#each data.banners as banner}
            <div
                class="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 group"
            >
                <div
                    class="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center flex-1 min-w-0"
                >
                    <div class="flex gap-2 shrink-0">
                        <div
                            class="w-16 h-12 md:w-20 md:h-14 rounded-xl bg-gray-50 flex items-center justify-center text-lg md:text-xl border border-gray-100 overflow-hidden relative"
                            title="Main Image"
                        >
                            {#if banner.image}
                                <img
                                    src={banner.image}
                                    alt=""
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                🖼️
                            {/if}
                            <div
                                class="absolute bottom-0 right-0 bg-black/50 text-[8px] text-white px-1"
                            >
                                IMG
                            </div>
                        </div>
                        <div
                            class="w-16 h-12 md:w-20 md:h-14 rounded-xl bg-gray-50 flex items-center justify-center text-lg md:text-xl border border-gray-100 overflow-hidden relative"
                            title="Background Image"
                        >
                            {#if banner.backgroundImage}
                                <img
                                    src={banner.backgroundImage}
                                    alt=""
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                🌄
                            {/if}
                            <div
                                class="absolute bottom-0 right-0 bg-black/50 text-[8px] text-white px-1"
                            >
                                BG
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 min-w-0 w-full">
                        <h3
                            class="font-heading font-bold text-gray-900 break-words line-clamp-2 md:line-clamp-none"
                        >
                            {banner.title}
                        </h3>
                        <p
                            class="text-xs text-gray-500 break-words mt-1 line-clamp-3 md:line-clamp-none"
                        >
                            {banner.subtitle}
                        </p>
                        <div class="mt-2 flex flex-wrap gap-2">
                            <span
                                class="text-[10px] font-bold px-2 py-0.5 rounded {banner.isActive
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-gray-100 text-gray-400'} uppercase"
                            >
                                {banner.isActive ? "Active" : "Hidden"}
                            </span>
                            <span
                                class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-brand-600 uppercase"
                                >Order: {banner.sortOrder}</span
                            >
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 shrink-0">
                    <button
                        on:click={() => {
                            editing = { ...banner };
                            showModal = true;
                        }}
                        class="px-4 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        on:click={() => deleteBanner(banner.id)}
                        class="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>

{#if showModal}
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[95vh]"
        >
            <div
                class="p-6 border-b border-gray-100 flex items-center justify-between"
            >
                <h3 class="font-heading font-bold text-xl">Banner Editor</h3>
                <button
                    on:click={() => (showModal = false)}
                    class="text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div class="p-8 space-y-6 overflow-y-auto flex-1">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <label class="label" for="ban-title">Title</label>
                            <input
                                id="ban-title"
                                type="text"
                                bind:value={editing.title}
                                placeholder="Large heading text"
                                class="input"
                            />
                        </div>
                        <div>
                            <label class="label" for="ban-subtitle"
                                >Subtitle</label
                            >
                            <textarea
                                id="ban-subtitle"
                                bind:value={editing.subtitle}
                                placeholder="Supporting description..."
                                class="input h-24 resize-none"
                            ></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="label" for="ban-cta-text"
                                    >CTA Text</label
                                >
                                <input
                                    id="ban-cta-text"
                                    type="text"
                                    bind:value={editing.ctaText}
                                    class="input"
                                />
                            </div>
                            <div>
                                <label class="label" for="ban-cta-link"
                                    >CTA Link</label
                                >
                                <input
                                    id="ban-cta-link"
                                    type="text"
                                    bind:value={editing.ctaLink}
                                    class="input"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <!-- Main Image -->
                        <div class="space-y-2">
                            <label class="label">Main Image (Foreground)</label>
                            <div
                                class="aspect-[4/3] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group"
                            >
                                {#if editing.image}
                                    <img
                                        src={editing.image}
                                        alt=""
                                        class="w-full h-full object-cover"
                                    />
                                    <div
                                        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                                    >
                                        <label
                                            for="img-main"
                                            class="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                            >Change</label
                                        >
                                        <button
                                            on:click={() =>
                                                removeImage("image")}
                                            class="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                                            >Remove</button
                                        >
                                    </div>
                                {:else}
                                    <label
                                        for="img-main"
                                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-400 hover:text-brand-600 transition-colors"
                                    >
                                        <span class="text-2xl">🖼️</span>
                                        <span
                                            class="text-[10px] font-bold uppercase tracking-wider"
                                            >Upload Main</span
                                        >
                                    </label>
                                {/if}
                                <input
                                    type="file"
                                    id="img-main"
                                    accept="image/*"
                                    on:change={(e) =>
                                        handleFileUpload(e, "image")}
                                    class="hidden"
                                />
                                {#if uploadingImage}
                                    <div
                                        class="absolute inset-0 bg-white/80 flex items-center justify-center"
                                    >
                                        <div
                                            class="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"
                                        ></div>
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Background Image -->
                        <div class="space-y-2">
                            <label class="label">Background Image</label>
                            <div
                                class="aspect-[4/3] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group"
                            >
                                {#if editing.backgroundImage}
                                    <img
                                        src={editing.backgroundImage}
                                        alt=""
                                        class="w-full h-full object-cover"
                                    />
                                    <div
                                        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                                    >
                                        <label
                                            for="img-bg"
                                            class="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                            >Change</label
                                        >
                                        <button
                                            on:click={() =>
                                                removeImage("backgroundImage")}
                                            class="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                                            >Remove</button
                                        >
                                    </div>
                                {:else}
                                    <label
                                        for="img-bg"
                                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-400 hover:text-brand-600 transition-colors"
                                    >
                                        <span class="text-2xl">🌄</span>
                                        <span
                                            class="text-[10px] font-bold uppercase tracking-wider"
                                            >Upload Background</span
                                        >
                                    </label>
                                {/if}
                                <input
                                    type="file"
                                    id="img-bg"
                                    accept="image/*"
                                    on:change={(e) =>
                                        handleFileUpload(e, "backgroundImage")}
                                    class="hidden"
                                />
                                {#if uploadingBgImage}
                                    <div
                                        class="absolute inset-0 bg-white/80 flex items-center justify-center"
                                    >
                                        <div
                                            class="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"
                                        ></div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                >
                    <div class="flex items-center gap-3">
                        <label
                            class="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                bind:checked={editing.isActive}
                                class="sr-only peer"
                            />
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"
                            ></div>
                        </label>
                        <span class="text-sm font-bold text-gray-700"
                            >Display this banner</span
                        >
                    </div>
                    <div class="flex items-center gap-3">
                        <label class="text-xs font-bold text-gray-400"
                            >Order</label
                        >
                        <input
                            type="number"
                            bind:value={editing.sortOrder}
                            class="w-16 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-400"
                        />
                    </div>
                </div>
            </div>

            <div
                class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl"
            >
                <button
                    on:click={() => (showModal = false)}
                    class="btn-ghost px-6 py-2.5"
                >
                    Cancel
                </button>
                <button on:click={save} class="btn-primary px-8 py-2.5">
                    {editing.id ? "Update Banner" : "Create Banner"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .label {
        @apply block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2;
    }
    .input {
        @apply w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors bg-white shadow-sm;
    }
</style>
