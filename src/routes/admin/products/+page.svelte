<script lang="ts">
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";
    export let data: PageData;

    let editingProduct: any = null;
    let showModal = false;
    let uploading = false;

    async function deleteProduct(id: number) {
        if (!confirm("Are you sure you want to delete this product?")) return;
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) invalidateAll();
    }

    async function handleFileUpload(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        uploading = true;
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const result = await res.json();
        if (res.ok) {
            editingProduct.image = result.url;
        } else {
            alert(result.error);
        }
        uploading = false;
    }

    async function saveProduct() {
        const method = editingProduct.id ? "PUT" : "POST";
        const url = editingProduct.id
            ? `/api/products/${editingProduct.id}`
            : "/api/products";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingProduct),
        });

        if (res.ok) {
            showModal = false;
            editingProduct = null;
            invalidateAll();
        }
    }

    function startNew() {
        editingProduct = {
            name: "",
            slug: "",
            volume: "",
            price: 0,
            categoryId: data.categories[0]?.id,
            isFeatured: false,
            inStock: true,
            sortOrder: 0,
        };
        showModal = true;
    }

    function startEdit(p: any) {
        editingProduct = { ...p };
        showModal = true;
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-heading font-extrabold text-gray-900">
            Products
        </h2>
        <button on:click={startNew} class="btn-primary text-sm"
            >Add New Product</button
        >
    </div>

    <div
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto"
    >
        <table class="w-full text-left">
            <thead>
                <tr
                    class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                >
                    <th class="px-6 py-4">Image</th>
                    <th class="px-6 py-4">Name / Slug</th>
                    <th class="px-6 py-4">Category</th>
                    <th class="px-6 py-4">Price / Vol</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                {#each data.products as product}
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                            <div
                                class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden"
                            >
                                {#if product.image}
                                    <img
                                        src={product.image}
                                        alt=""
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <div
                                        class="w-full h-full flex items-center justify-center text-xl"
                                    >
                                        💧
                                    </div>
                                {/if}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-semibold text-gray-900">
                                {product.name}
                            </div>
                            <div
                                class="text-[10px] text-gray-400 font-mono uppercase"
                            >
                                {product.slug}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            {data.categories.find(
                                (c) => c.id === product.categoryId,
                            )?.name ?? "N/A"}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                            ₹{product.price}
                            <span class="text-gray-400">/</span>
                            {product.volume}
                        </td>
                        <td class="px-6 py-4">
                            {#if product.isFeatured}
                                <span
                                    class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 mr-2 uppercase"
                                    >Featured</span
                                >
                            {/if}
                            {#if product.inStock}
                                <span
                                    class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 uppercase"
                                    >In Stock</span
                                >
                            {:else}
                                <span
                                    class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 uppercase"
                                    >Out</span
                                >
                            {/if}
                        </td>
                        <td class="px-6 py-4 text-right text-sm">
                            <button
                                on:click={() => startEdit(product)}
                                class="text-brand-600 hover:text-brand-800 font-semibold mr-4"
                                >Edit</button
                            >
                            <button
                                on:click={() => deleteProduct(product.id)}
                                class="text-red-500 hover:text-red-700 font-semibold"
                                >Delete</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

{#if showModal}
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col"
        >
            <div
                class="p-6 border-b border-gray-100 flex items-center justify-between"
            >
                <h3 class="font-heading font-bold text-xl">
                    {editingProduct.id ? "Edit Product" : "New Product"}
                </h3>
                <button
                    on:click={() => (showModal = false)}
                    class="text-gray-400 hover:text-gray-900 transition-colors"
                    aria-label="Close modal"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        /></svg
                    >
                </button>
            </div>

            <div class="p-8 space-y-5 overflow-y-auto">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2 sm:col-span-1">
                        <label class="label" for="prod-name">Product Name</label
                        >
                        <input
                            id="prod-name"
                            type="text"
                            bind:value={editingProduct.name}
                            class="input"
                            placeholder="e.g. 1L Bottle"
                        />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <label class="label" for="prod-slug">Slug</label>
                        <input
                            id="prod-slug"
                            type="text"
                            bind:value={editingProduct.slug}
                            class="input"
                            placeholder="e.g. 1l-bottle"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="label" for="prod-vol">Volume</label>
                        <input
                            id="prod-vol"
                            type="text"
                            bind:value={editingProduct.volume}
                            class="input"
                            placeholder="e.g. 1000ml"
                        />
                    </div>
                    <div>
                        <label class="label" for="prod-price">Price (₹)</label>
                        <input
                            id="prod-price"
                            type="number"
                            bind:value={editingProduct.price}
                            class="input"
                        />
                    </div>
                </div>

                <div>
                    <label class="label" for="prod-cat">Category</label>
                    <select
                        id="prod-cat"
                        bind:value={editingProduct.categoryId}
                        class="input"
                    >
                        {#each data.categories as cat}
                            <option value={cat.id}>{cat.name}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label class="label" for="prod-desc">Description</label>
                    <textarea
                        id="prod-desc"
                        bind:value={editingProduct.description}
                        class="input h-24 resize-none"
                    ></textarea>
                </div>

                <div>
                    <label class="label" for="admin-product-img"
                        >Product Image</label
                    >
                    <div class="flex items-center gap-4">
                        <div
                            class="w-16 h-16 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0"
                        >
                            {#if editingProduct.image}
                                <img
                                    src={editingProduct.image}
                                    alt=""
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <span class="text-2xl opacity-30">🖼️</span>
                            {/if}
                        </div>
                        <div class="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                on:change={handleFileUpload}
                                class="hidden"
                                id="admin-product-img"
                            />
                            <label
                                for="admin-product-img"
                                class="btn-outline text-xs cursor-pointer py-2"
                            >
                                {uploading ? "Uploading..." : "Choose Image"}
                            </label>
                            <p class="text-[10px] text-gray-400 mt-2">
                                JPEG, PNG or WebP. Max 2MB.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex gap-6 pt-2">
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            bind:checked={editingProduct.isFeatured}
                            class="w-4 h-4 rounded text-brand-500"
                        />
                        <span class="text-sm font-medium text-gray-700"
                            >Featured</span
                        >
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            bind:checked={editingProduct.inStock}
                            class="w-4 h-4 rounded text-brand-500"
                        />
                        <span class="text-sm font-medium text-gray-700"
                            >In Stock</span
                        >
                    </label>
                </div>
            </div>

            <div
                class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl"
            >
                <button
                    on:click={() => (showModal = false)}
                    class="btn-ghost px-6 py-2.5">Cancel</button
                >
                <button on:click={saveProduct} class="btn-primary px-8 py-2.5"
                    >Save Changes</button
                >
            </div>
        </div>
    </div>
{/if}

<style>
    .label {
        @apply block text-sm font-semibold text-gray-700 mb-1.5;
    }
    .input {
        @apply w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors bg-white;
    }
</style>
