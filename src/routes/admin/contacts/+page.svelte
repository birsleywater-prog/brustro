<script lang="ts">
    import type { PageData } from "./$types";
    export let data: PageData;

    const parseDate = (dateStr: string | null) => {
        if (!dateStr) return new Date();
        // If it's the old SQLite format "YYYY-MM-DD HH:MM:SS", assume UTC and append 'Z'
        if (dateStr.length === 19 && !dateStr.includes("T")) {
            return new Date(dateStr.replace(" ", "T") + "Z");
        }
        return new Date(dateStr);
    };
</script>

<div class="space-y-6">
    <h2 class="text-2xl font-heading font-extrabold text-gray-900">
        Contact Leads
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each data.contacts as lead}
            <div
                class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
                <div class="flex items-center justify-between">
                    <h3 class="font-heading font-bold text-gray-900">
                        {lead.name}
                    </h3>
                    <span class="text-[10px] text-gray-400">
                        {lead.createdAt
                            ? parseDate(lead.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  },
                              )
                            : "Recently"}
                    </span>
                </div>
                <div class="text-xs text-gray-500 space-y-1">
                    <p>
                        ✉️ <a
                            href="mailto:{lead.email}"
                            class="text-brand-600 hover:underline"
                            >{lead.email}</a
                        >
                    </p>
                    {#if lead.phone}<p>📞 {lead.phone}</p>{/if}
                </div>
                <div
                    class="p-4 bg-gray-50 rounded-xl text-sm italic text-gray-600 leading-relaxed"
                >
                    "{lead.message}"
                </div>
            </div>
        {/each}
    </div>
</div>
