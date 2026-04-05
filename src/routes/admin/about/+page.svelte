<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData, PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    let uploading = false;
    let aboutImage = data.aboutSettings.about_image || "";
    $: aboutImage = data.aboutSettings.about_image || "";

    async function handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        uploading = true;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.url) {
                aboutImage = result.url;
            } else {
                alert(result.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        } finally {
            uploading = false;
        }
    }
</script>

<div class="max-w-4xl">
    <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Edit About Page</h1>
        <p class="text-gray-500">
            Update the content and image of the About section.
        </p>
    </div>

    {#if form?.success}
        <div
            class="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100"
        >
            Settings updated successfully!
        </div>
    {/if}

    {#if form?.message}
        <div
            class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100"
        >
            {form.message}
        </div>
    {/if}

    <form
        method="POST"
        use:enhance={() => {
            return async ({ update }) => {
                await update();
                window.scrollTo({ top: 0, behavior: "smooth" });
            };
        }}
        class="space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
    >
        <input type="hidden" name="about_image" value={aboutImage} />

        <div class="grid grid-cols-1 gap-6">
            <!-- Hero Section -->
            <div class="space-y-4">
                <h2 class="text-lg font-semibold text-brand-600 border-b pb-2">
                    Hero Section
                </h2>
                <div class="space-y-2">
                    <label
                        for="about_hero_title"
                        class="block text-sm font-medium text-gray-700"
                        >Hero Title</label
                    >
                    <input
                        type="text"
                        id="about_hero_title"
                        name="about_hero_title"
                        value={data.aboutSettings.about_hero_title}
                        required
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                </div>
                <div class="space-y-2">
                    <label
                        for="about_hero_description"
                        class="block text-sm font-medium text-gray-700"
                        >Hero Description</label
                    >
                    <textarea
                        id="about_hero_description"
                        name="about_hero_description"
                        rows="3"
                        required
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        >{data.aboutSettings.about_hero_description}</textarea
                    >
                </div>
            </div>

            <!-- Our Story Section -->
            <div class="space-y-4 pt-4">
                <h2 class="text-lg font-semibold text-brand-600 border-b pb-2">
                    Our Story Section
                </h2>
                <div class="space-y-2">
                    <label
                        for="about_story_title"
                        class="block text-sm font-medium text-gray-700"
                        >Story Title</label
                    >
                    <input
                        type="text"
                        id="about_story_title"
                        name="about_story_title"
                        value={data.aboutSettings.about_story_title}
                        required
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                </div>
                <div class="space-y-2">
                    <label
                        for="about_story_content_1"
                        class="block text-sm font-medium text-gray-700"
                        >Story Paragraph 1</label
                    >
                    <textarea
                        id="about_story_content_1"
                        name="about_story_content_1"
                        rows="4"
                        required
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        >{data.aboutSettings.about_story_content_1}</textarea
                    >
                </div>
                <div class="space-y-2">
                    <label
                        for="about_story_content_2"
                        class="block text-sm font-medium text-gray-700"
                        >Story Paragraph 2</label
                    >
                    <textarea
                        id="about_story_content_2"
                        name="about_story_content_2"
                        rows="4"
                        required
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        >{data.aboutSettings.about_story_content_2}</textarea
                    >
                </div>
            </div>

            <!-- Image Upload -->
            <div class="space-y-4 pt-4">
                <h2 class="text-lg font-semibold text-brand-600 border-b pb-2">
                    Section Image
                </h2>
                <p class="text-sm text-gray-500 italic">
                    This image will replace the factory emoji (🏭) on the About
                    page.
                </p>
                <div class="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                    <div
                        class="w-32 h-32 md:w-48 md:h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-dashed border-gray-200 shrink-0 mx-auto md:mx-0"
                    >
                        {#if aboutImage}
                            <img
                                src={aboutImage}
                                alt="About section"
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <span class="text-4xl">🏭</span>
                        {/if}
                    </div>
                    <div class="flex-1 space-y-4">
                        <div class="space-y-2">
                            <label
                                for="image_upload"
                                class="block text-sm font-medium text-gray-700"
                                >Upload New Image</label
                            >
                            <input
                                type="file"
                                id="image_upload"
                                accept="image/*"
                                on:change={handleFileUpload}
                                disabled={uploading}
                                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer disabled:opacity-50"
                            />
                            {#if uploading}
                                <p class="text-xs text-brand-600 font-medium">
                                    Uploading...
                                </p>
                            {/if}
                        </div>
                        {#if aboutImage}
                            <button
                                type="button"
                                on:click={() => (aboutImage = "")}
                                class="text-sm text-red-600 font-medium hover:text-red-700"
                            >
                                Restore Emoji
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <div class="pt-6 border-t border-gray-100 flex justify-end">
            <button
                type="submit"
                class="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-100"
            >
                Save Changes
            </button>
        </div>
    </form>
</div>
