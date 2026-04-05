<script lang="ts">
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";

    export let data: PageData;

    let editing: any = null;
    let showModal = false;
    let uploadingImage = false;

    async function handleFileUpload(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        uploadingImage = true;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                editing.avatar = result.url;
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            uploadingImage = false;
        }
    }

    async function deleteReview(id: number) {
        if (!confirm("Are you sure you want to delete this review?")) return;
        const res = await fetch("/api/reviews", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) invalidateAll();
        else alert("Failed to delete review");
    }

    async function save() {
        const method = editing.id ? "PUT" : "POST";
        const res = await fetch("/api/reviews", {
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
            alert(err.error || "Failed to save review");
        }
    }

    function startNew() {
        editing = {
            name: "",
            role: "",
            company: "",
            content: "",
            rating: 5,
            avatar: "",
            isActive: true,
        };
        showModal = true;
    }

    function removeImage() {
        editing.avatar = "";
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-heading font-extrabold text-gray-900">
            Reviews
        </h2>
        <button on:click={startNew} class="btn-primary text-sm"
            >Add Review</button
        >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each data.reviews as review}
            <div
                class="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 group"
            >
                <div class="flex items-start gap-4">
                    <div
                        class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xl border border-gray-100 overflow-hidden shrink-0"
                    >
                        {#if review.avatar}
                            <img
                                src={review.avatar}
                                alt={review.name}
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            👤
                        {/if}
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h3 class="font-heading font-bold text-gray-900 truncate">
                                {review.name}
                            </h3>
                            <div class="flex text-yellow-400 text-xs">
                                <!-- Create stars up to 5 -> repeat rating times -->
                                {#each Array(5) as _, i}
                                    <span class={i < (review.rating || 5) ? "" : "text-gray-200"}>★</span>
                                {/each}
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 truncate">
                            {review.role}{#if review.company} • {review.company}{/if}
                        </p>
                        <p class="text-sm text-gray-700 mt-2 line-clamp-3">
                            "{review.content}"
                        </p>
                        <div class="mt-3">
                            <span
                                class="text-[10px] font-bold px-2 py-0.5 rounded {review.isActive
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-gray-100 text-gray-400'} uppercase"
                            >
                                {review.isActive ? "Active" : "Hidden"}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 justify-end pt-4 border-t border-gray-50 mt-auto">
                    <button
                        on:click={() => {
                            editing = { ...review };
                            showModal = true;
                        }}
                        class="px-4 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        on:click={() => deleteReview(review.id)}
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
                <h3 class="font-heading font-bold text-xl">Review Editor</h3>
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
                            <label class="label" for="rev-name">Name *</label>
                            <input
                                id="rev-name"
                                type="text"
                                bind:value={editing.name}
                                placeholder="Customer Name"
                                class="input"
                            />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="label" for="rev-role">Role</label>
                                <input
                                    id="rev-role"
                                    type="text"
                                    bind:value={editing.role}
                                    placeholder="e.g. CEO"
                                    class="input"
                                />
                            </div>
                            <div>
                                <label class="label" for="rev-company"
                                    >Company</label
                                >
                                <input
                                    id="rev-company"
                                    type="text"
                                    bind:value={editing.company}
                                    placeholder="e.g. Acme Corp"
                                    class="input"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="label" for="rev-content"
                                >Review Content *</label
                            >
                            <textarea
                                id="rev-content"
                                bind:value={editing.content}
                                placeholder="They are the best..."
                                class="input h-32 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <!-- Avatar Image -->
                        <div class="space-y-2">
                            <label class="label">Avatar Image</label>
                            <div
                                class="aspect-square w-32 rounded-full mx-auto bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group"
                            >
                                {#if editing.avatar}
                                    <img
                                        src={editing.avatar}
                                        alt=""
                                        class="w-full h-full object-cover"
                                    />
                                    <div
                                        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                                    >
                                        <label
                                            for="img-avatar"
                                            class="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                            >Change</label
                                        >
                                        <button
                                            on:click={removeImage}
                                            class="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                                            >Remove</button
                                        >
                                    </div>
                                {:else}
                                    <label
                                        for="img-avatar"
                                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-400 hover:text-brand-600 transition-colors"
                                    >
                                        <span class="text-2xl">👤</span>
                                        <span
                                            class="text-[10px] font-bold uppercase tracking-wider text-center"
                                            >Upload</span
                                        >
                                    </label>
                                {/if}
                                <input
                                    type="file"
                                    id="img-avatar"
                                    accept="image/*"
                                    on:change={handleFileUpload}
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

                        <div>
                            <label class="label" for="rev-rating"
                                >Rating (1-5)</label
                            >
                            <input
                                id="rev-rating"
                                type="number"
                                min="1"
                                max="5"
                                bind:value={editing.rating}
                                class="input"
                            />
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
                            >Display this review</span
                        >
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
                <button
                    on:click={save}
                    class="btn-primary px-8 py-2.5"
                    disabled={!editing.name || !editing.content}
                >
                    {editing.id ? "Update Review" : "Create Review"}
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
