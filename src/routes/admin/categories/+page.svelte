<script lang="ts">
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";
    export let data: PageData;

    let editing: any = null;
    let showModal = false;

    async function deleteCat(id: number) {
        if (
            !confirm("Are you sure? This may affect products in this category.")
        )
            return;
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (res.ok) invalidateAll();
    }

    async function save() {
        const method = editing.id ? "PUT" : "POST";
        const url = editing.id
            ? `/api/categories/${editing.id}`
            : "/api/categories";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editing),
        });
        if (res.ok) {
            showModal = false;
            editing = null;
            invalidateAll();
        }
    }

    function startNew() {
        editing = { name: "", slug: "", description: "" };
        showModal = true;
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-heading font-extrabold text-gray-900">
            Categories
        </h2>
        <button on:click={startNew} class="btn-primary text-sm"
            >Add Category</button
        >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.categories as cat}
            <div
                class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group"
            >
                <h3 class="font-heading font-bold text-gray-900 mb-1">
                    {cat.name}
                </h3>
                <p
                    class="text-[10px] text-gray-400 font-mono mb-3 uppercase tracking-wider"
                >
                    {cat.slug}
                </p>
                <p class="text-xs text-gray-500 mb-6 line-clamp-2">
                    {cat.description ?? "No description."}
                </p>
                <div
                    class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <button
                        on:click={() => {
                            editing = { ...cat };
                            showModal = true;
                        }}
                        class="text-xs font-bold text-brand-600">Edit</button
                    >
                    <button
                        on:click={() => deleteCat(cat.id)}
                        class="text-xs font-bold text-red-500">Delete</button
                    >
                </div>
            </div>
        {/each}
    </div>
</div>

{#if showModal}
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
            <h3 class="font-heading font-bold text-xl mb-6">
                {editing.id ? "Edit Category" : "New Category"}
            </h3>
            <div class="space-y-4">
                <div>
                    <label class="label" for="cat-name">Category Name</label>
                    <input
                        id="cat-name"
                        type="text"
                        bind:value={editing.name}
                        class="input"
                    />
                </div>
                <div>
                    <label class="label" for="cat-slug">Slug</label>
                    <input
                        id="cat-slug"
                        type="text"
                        bind:value={editing.slug}
                        class="input"
                    />
                </div>
                <div>
                    <label class="label" for="cat-desc">Description</label>
                    <textarea
                        id="cat-desc"
                        bind:value={editing.description}
                        class="input h-24"
                    ></textarea>
                </div>
            </div>
            <div class="mt-8 flex justify-end gap-3">
                <button on:click={() => (showModal = false)} class="btn-ghost"
                    >Cancel</button
                >
                <button on:click={save} class="btn-primary px-8">Save</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .label {
        @apply block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5;
    }
    .input {
        @apply w-full px-4 py-3 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors bg-gray-50;
    }
</style>
