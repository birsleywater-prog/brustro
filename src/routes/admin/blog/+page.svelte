<script lang="ts">
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";
    import { onMount, tick } from "svelte";

    export let data: PageData;

    let editing: any = null;
    let showModal = false;
    let uploading = false;
    let quill: any;
    let editorContainer: HTMLElement;

    async function handleFileUpload(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        uploading = true;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                editing.image = result.url;
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            uploading = false;
        }
    }

    async function save() {
        if (quill) {
            editing.content = quill.root.innerHTML;
        }

        const method = editing.id ? "PUT" : "POST";
        const res = await fetch("/api/blog", {
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
            alert(err.error || "Failed to save post");
        }
    }

    async function deletePost(id: number) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const res = await fetch("/api/blog", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        if (res.ok) {
            invalidateAll();
        } else {
            alert("Failed to delete post");
        }
    }

    function startNew() {
        editing = { title: "", slug: "", excerpt: "", content: "", image: "" };
        showModal = true;
    }

    function startEdit(post: any) {
        editing = { ...post };
        showModal = true;
    }

    async function initQuill() {
        await tick();
        if (
            typeof window !== "undefined" &&
            (window as any).Quill &&
            editorContainer
        ) {
            // Robustly remove existing toolbars from parent to prevent duplicates
            const parent = editorContainer.parentElement;
            if (parent) {
                const toolbars = parent.querySelectorAll(".ql-toolbar");
                toolbars.forEach((tb) => tb.remove());
            }

            // Clear container before new instance
            editorContainer.innerHTML = "";

            quill = new (window as any).Quill(editorContainer, {
                theme: "snow",
                placeholder: "Write something amazing...",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "code-block"],
                        ["clean"],
                    ],
                },
            });
            if (editing.content) {
                quill.root.innerHTML = editing.content;
            }
        }
    }

    function removeImage() {
        editing.image = "";
    }

    onMount(() => {
        if (!document.getElementById("quill-css")) {
            const link = document.createElement("link");
            link.id = "quill-css";
            link.rel = "stylesheet";
            link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
            document.head.appendChild(link);
        }
        if (!document.getElementById("quill-js")) {
            const script = document.createElement("script");
            script.id = "quill-js";
            script.src = "https://cdn.quilljs.com/1.3.6/quill.min.js";
            script.onload = () => {
                if (showModal) initQuill();
            };
            document.head.appendChild(script);
        }
    });

    $: if (showModal && (window as any).Quill && !quill) {
        initQuill();
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-heading font-extrabold text-gray-900">
            Blog Posts
        </h2>
        <button on:click={startNew} class="btn-primary text-sm">New Post</button
        >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.posts as post}
            <div
                class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group flex flex-col"
            >
                <div class="aspect-video bg-gray-100 relative overflow-hidden">
                    {#if post.image}
                        <img
                            src={post.image}
                            alt=""
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    {:else}
                        <div
                            class="w-full h-full flex items-center justify-center text-3xl opacity-20"
                        >
                            📰
                        </div>
                    {/if}
                </div>
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex-1">
                        <h3
                            class="font-heading font-bold text-gray-900 mb-2 line-clamp-1"
                        >
                            {post.title}
                        </h3>
                        <p class="text-xs text-gray-500 line-clamp-2 mb-4">
                            {post.excerpt}
                        </p>
                    </div>
                    <div
                        class="flex items-center justify-between pt-4 border-t border-gray-50"
                    >
                        <span
                            class="text-[10px] text-gray-400 font-medium uppercase tracking-wider"
                        >
                            {new Date(post.publishedAt).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                },
                            )}
                        </span>
                        <div class="flex gap-4">
                            <button
                                on:click={() => startEdit(post)}
                                class="text-xs font-bold text-brand-600 hover:text-brand-800"
                                >Edit</button
                            >
                            <button
                                on:click={() => deletePost(post.id)}
                                class="text-xs font-bold text-red-500 hover:text-red-700"
                                >Delete</button
                            >
                        </div>
                    </div>
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
            class="bg-white rounded-3xl w-full max-w-4xl shadow-2xl max-h-[95vh] flex flex-col"
        >
            <div
                class="p-6 border-b border-gray-100 flex items-center justify-between"
            >
                <h3 class="font-heading font-bold text-xl">
                    {editing.id ? "Edit Post" : "New Post"}
                </h3>
                <button
                    on:click={() => {
                        showModal = false;
                        quill = null;
                    }}
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

            <div class="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <label class="label" for="blog-title">Title</label>
                            <input
                                id="blog-title"
                                type="text"
                                bind:value={editing.title}
                                class="input"
                                placeholder="Post title..."
                            />
                        </div>
                        <div>
                            <label class="label" for="blog-slug">Slug</label>
                            <input
                                id="blog-slug"
                                type="text"
                                bind:value={editing.slug}
                                class="input"
                                placeholder="post-slug-url"
                            />
                        </div>
                        <div>
                            <label class="label" for="blog-excerpt"
                                >Excerpt</label
                            >
                            <textarea
                                id="blog-excerpt"
                                bind:value={editing.excerpt}
                                class="input h-24 resize-none"
                                placeholder="Short summary..."
                            ></textarea>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <label class="label" for="blog-image"
                            >Featured Image</label
                        >
                        <div
                            class="aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group"
                        >
                            {#if editing.image}
                                <img
                                    src={editing.image}
                                    alt=""
                                    class="w-full h-full object-cover"
                                />
                                <div
                                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
                                >
                                    <label
                                        for="blog-image"
                                        class="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100"
                                    >
                                        Change
                                    </label>
                                    <button
                                        type="button"
                                        on:click={removeImage}
                                        class="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            {:else}
                                <label
                                    for="blog-image"
                                    class="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-brand-600 transition-colors"
                                >
                                    <span class="text-3xl">🖼️</span>
                                    <span class="text-xs font-bold"
                                        >Upload Image</span
                                    >
                                </label>
                            {/if}
                            <input
                                type="file"
                                id="blog-image"
                                accept="image/*"
                                on:change={handleFileUpload}
                                class="hidden"
                            />
                            {#if uploading}
                                <div
                                    class="absolute inset-0 bg-white/80 flex items-center justify-center"
                                >
                                    <div
                                        class="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"
                                    ></div>
                                </div>
                            {/if}
                        </div>
                        {#if editing.image}
                            <button
                                type="button"
                                on:click={removeImage}
                                class="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl border border-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>🗑️</span> Remove Featured Image
                            </button>
                        {/if}
                    </div>
                </div>

                <div>
                    <label class="label" for="blog-editor">Content</label>
                    <div
                        class="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                    >
                        <div
                            id="blog-editor"
                            bind:this={editorContainer}
                            class="h-96"
                        ></div>
                    </div>
                </div>
            </div>

            <div
                class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl"
            >
                <button
                    on:click={() => {
                        showModal = false;
                        quill = null;
                    }}
                    class="btn-ghost px-6 py-2.5"
                >
                    Cancel
                </button>
                <button on:click={save} class="btn-primary px-8 py-2.5">
                    {editing.id ? "Update Post" : "Publish Post"}
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
        @apply w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors bg-white;
    }
    :global(.ql-toolbar.ql-snow) {
        @apply border-0 border-b border-gray-100 p-4 bg-gray-50;
    }
    :global(.ql-container.ql-snow) {
        @apply border-0 font-sans text-base;
    }
    :global(.ql-editor) {
        @apply min-h-[300px] p-6;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        @apply bg-transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        @apply bg-gray-200 rounded-full hover:bg-gray-300 transition-colors;
    }
</style>
