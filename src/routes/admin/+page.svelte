<script lang="ts">
    import type { PageData } from "./$types";
    export let data: PageData;

    let orderFilter: "all" | "pending" | "fulfilled" = "all";
    let orderSort: "newest" | "oldest" | "value" = "newest";
    let contactSort: "newest" | "oldest" = "newest";

    const parseDate = (dateStr: string | null) => {
        if (!dateStr) return new Date(0);
        // If it's the old SQLite format "YYYY-MM-DD HH:MM:SS", assume UTC and append 'Z'
        if (dateStr.length === 19 && !dateStr.includes("T")) {
            return new Date(dateStr.replace(" ", "T") + "Z");
        }
        return new Date(dateStr);
    };

    $: filteredOrders = data.recentOrders
        .filter((o) =>
            orderFilter === "all" ? true : o.status === orderFilter,
        )
        .sort((a, b) => {
            if (orderSort === "newest")
                return (
                    parseDate(b.createdAt).getTime() -
                    parseDate(a.createdAt).getTime()
                );
            if (orderSort === "oldest")
                return (
                    parseDate(a.createdAt).getTime() -
                    parseDate(b.createdAt).getTime()
                );
            if (orderSort === "value") return (b.total || 0) - (a.total || 0);
            return 0;
        });

    $: sortedContacts = [...data.recentContacts].sort((a, b) => {
        if (contactSort === "newest")
            return (
                parseDate(b.createdAt).getTime() -
                parseDate(a.createdAt).getTime()
            );
        if (contactSort === "oldest")
            return (
                parseDate(a.createdAt).getTime() -
                parseDate(b.createdAt).getTime()
            );
        return 0;
    });
</script>

<div class="space-y-8 animate-in fade-in duration-500">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each [{ label: "Total Products", value: data.stats.products, color: "text-blue-600", bg: "bg-blue-50", icon: "🛒" }, { label: "Active Categories", value: data.stats.categories, color: "text-purple-600", bg: "bg-purple-50", icon: "📁" }, { label: "New Orders", value: data.stats.orders, color: "text-green-600", bg: "bg-green-50", icon: "📦" }, { label: "Blog Posts", value: data.stats.blog, color: "text-orange-600", bg: "bg-orange-50", icon: "📰" }] as stat}
            <div
                class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
                <div>
                    <p
                        class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                    >
                        {stat.label}
                    </p>
                    <p class="text-3xl font-extrabold text-gray-900">
                        {stat.value}
                    </p>
                </div>
                <div
                    class="w-12 h-12 rounded-xl {stat.bg} {stat.color} flex items-center justify-center text-xl"
                >
                    {stat.icon}
                </div>
            </div>
        {/each}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Orders -->
        <div
            class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
            <div
                class="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div class="flex items-center gap-4">
                    <h3 class="font-heading font-bold text-gray-900">
                        Recent Orders
                    </h3>
                    <div class="flex p-0.5 bg-gray-100 rounded-lg">
                        {#each ["all", "pending", "fulfilled"] as f}
                            <button
                                class="px-2 py-0.5 text-[8px] font-bold rounded-md transition-all {orderFilter ===
                                f
                                    ? 'bg-white text-brand-600 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'}"
                                on:click={() =>
                                    (orderFilter = f as
                                        | "all"
                                        | "pending"
                                        | "fulfilled")}
                            >
                                {f.toUpperCase()}
                            </button>
                        {/each}
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <select
                        bind:value={orderSort}
                        class="text-[10px] font-bold text-gray-400 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-gray-600"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="value">Highest Value</option>
                    </select>
                    <a
                        href="/admin/orders"
                        class="text-xs font-semibold text-brand-600 hover:underline"
                        >View All</a
                    >
                </div>
            </div>
            <div class="overflow-auto max-h-[450px]">
                {#if filteredOrders.length === 0}
                    <div class="p-8 text-center text-gray-400 text-sm italic">
                        No orders match filters.
                    </div>
                {:else}
                    <table
                        class="w-full text-left border-separate border-spacing-0"
                    >
                        <thead class="sticky top-0 z-10 bg-white">
                            <tr
                                class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                            >
                                <th class="px-6 py-3 border-b border-gray-100"
                                    >Customer</th
                                >
                                <th class="px-6 py-3 border-b border-gray-100"
                                    >Total</th
                                >
                                <th class="px-6 py-3 border-b border-gray-100"
                                    >Status</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            {#each filteredOrders as order}
                                <tr>
                                    <td class="px-6 py-4">
                                        <div
                                            class="text-sm font-semibold text-gray-900"
                                        >
                                            {order.customerName}
                                        </div>
                                        <div class="text-xs text-gray-400">
                                            {order.createdAt
                                                ? parseDate(
                                                      order.createdAt,
                                                  ).toLocaleDateString(
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
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-700"
                                        >₹{(order.total ?? 0).toFixed(0)}</td
                                    >
                                    <td class="px-6 py-4">
                                        <span
                                            class="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600"
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
        </div>

        <!-- Recent Contacts -->
        <div
            class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
            <div
                class="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <h3 class="font-heading font-bold text-gray-900">
                    Recent Contact Messages
                </h3>
                <div class="flex items-center gap-3">
                    <select
                        bind:value={contactSort}
                        class="text-[10px] font-bold text-gray-400 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-gray-600"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    <a
                        href="/admin/contacts"
                        class="text-xs font-semibold text-brand-600 hover:underline"
                        >View All</a
                    >
                </div>
            </div>
            <div class="p-6 space-y-4 overflow-y-auto max-h-[450px]">
                {#if sortedContacts.length === 0}
                    <div class="text-center text-gray-400 text-sm italic">
                        No messages yet.
                    </div>
                {:else}
                    {#each sortedContacts as contact}
                        <div
                            class="flex gap-3 p-3 md:p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold shrink-0 text-xs md:text-sm"
                            >
                                {contact.name.charAt(0)}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p
                                    class="text-sm font-semibold text-gray-900 mb-0.5 truncate"
                                >
                                    {contact.name}
                                </p>
                                <p
                                    class="text-xs text-gray-500 line-clamp-2 md:line-clamp-1 mb-2 break-words"
                                >
                                    {contact.message}
                                </p>
                                <div
                                    class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-400"
                                >
                                    <span
                                        class="truncate max-w-[150px] sm:max-w-none"
                                        >✉️ {contact.email}</span
                                    >
                                    <span class="shrink-0"
                                        >📅 {contact.createdAt
                                            ? parseDate(
                                                  contact.createdAt,
                                              ).toLocaleDateString("en-IN", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "Recently"}</span
                                    >
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>
