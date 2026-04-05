<script lang="ts">
    import type { PageData } from "./$types";
    import { invalidateAll } from "$app/navigation";

    export let data: PageData;

    let currentFilter: "all" | "pending" | "dispatched" | "fulfilled" | "spam" =
        "all";
    let dateFilter:
        | "all"
        | "today"
        | "yesterday"
        | "week"
        | "month"
        | "year"
        | "custom" = "all";
    let customStart = "";
    let customEnd = "";

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const parseDate = (dateStr: string | null) => {
        if (!dateStr) return new Date();
        // If it's the old SQLite format "YYYY-MM-DD HH:MM:SS", assume UTC and append 'Z'
        if (dateStr.length === 19 && !dateStr.includes("T")) {
            return new Date(dateStr.replace(" ", "T") + "Z");
        }
        return new Date(dateStr);
    };

    $: filteredOrders = data.orders.filter((o) => {
        // Status filter
        if (currentFilter !== "all" && o.status !== currentFilter) return false;

        // Date filter
        if (dateFilter === "all") return true;

        const orderDate = parseDate(o.createdAt);
        const now = new Date();

        if (dateFilter === "today") return isSameDay(orderDate, now);

        if (dateFilter === "yesterday") {
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            return isSameDay(orderDate, yesterday);
        }

        if (dateFilter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return orderDate >= weekAgo;
        }

        if (dateFilter === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return orderDate >= monthAgo;
        }

        if (dateFilter === "year") {
            const yearAgo = new Date();
            yearAgo.setFullYear(now.getFullYear() - 1);
            return orderDate >= yearAgo;
        }

        if (dateFilter === "custom") {
            if (!customStart || !customEnd) return true;
            const start = new Date(customStart);
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999); // Inclusion of full end day
            return orderDate >= start && orderDate <= end;
        }

        return true;
    });

    $: totalValue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    async function updateStatus(id: number, status: string) {
        if (!confirm(`Mark this order as ${status}?`)) return;

        try {
            const res = await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            if (res.ok) {
                await invalidateAll();
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating status");
        }
    }

    const filters = [
        { id: "all", label: "All Status" },
        { id: "pending", label: "Pending" },
        { id: "dispatched", label: "Dispatched" },
        { id: "fulfilled", label: "Fulfilled" },
        { id: "spam", label: "Spam" },
    ] as const;

    const dateFilters = [
        { id: "all", label: "Anytime" },
        { id: "today", label: "Today" },
        { id: "yesterday", label: "Yesterday" },
        { id: "week", label: "Past Week" },
        { id: "month", label: "Past Month" },
        { id: "year", label: "Past Year" },
        { id: "custom", label: "Custom Range" },
    ] as const;
</script>

<div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div
                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"
            >
                Total Orders
            </div>
            <div class="text-3xl font-extrabold text-gray-900">
                {filteredOrders.length}
            </div>
            <div class="text-xs text-gray-400 mt-1">Found based on filters</div>
        </div>
        <div
            class="bg-brand-500 p-6 rounded-2xl shadow-lg shadow-brand-100 text-white"
        >
            <div
                class="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1"
            >
                Total Revenue
            </div>
            <div class="text-3xl font-extrabold">
                ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <div class="text-xs text-white/70 mt-1">Sum of filtered orders</div>
        </div>
        <div
            class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center"
        >
            <div
                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2"
            >
                Current View
            </div>
            <div class="flex flex-wrap gap-2">
                <span
                    class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase"
                    >{currentFilter}</span
                >
                <span
                    class="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-[10px] font-bold uppercase"
                    >{dateFilter.replace("all", "Anytime")}</span
                >
            </div>
        </div>
    </div>

    <div
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
    >
        <div
            class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
            <div class="flex flex-col sm:flex-row flex-wrap gap-3">
                <div
                    class="flex p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar max-w-full"
                >
                    <div class="flex flex-nowrap min-w-max">
                        {#each filters as filter}
                            <button
                                class="px-3 py-1 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap {currentFilter ===
                                filter.id
                                    ? 'bg-white text-brand-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'}"
                                on:click={() => (currentFilter = filter.id)}
                            >
                                {filter.label}
                            </button>
                        {/each}
                    </div>
                </div>

                <div
                    class="flex p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar max-w-full"
                >
                    <div class="flex flex-nowrap min-w-max">
                        {#each dateFilters as dFilter}
                            <button
                                class="px-3 py-1 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap {dateFilter ===
                                dFilter.id
                                    ? 'bg-white text-brand-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'}"
                                on:click={() => (dateFilter = dFilter.id)}
                            >
                                {dFilter.label}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            {#if dateFilter === "custom"}
                <div class="flex items-center gap-2 animate-fade-in">
                    <input
                        type="date"
                        bind:value={customStart}
                        class="text-xs p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 ring-brand-500/20"
                    />
                    <span class="text-gray-400 text-xs">to</span>
                    <input
                        type="date"
                        bind:value={customEnd}
                        class="text-xs p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 ring-brand-500/20"
                    />
                </div>
            {/if}
        </div>
    </div>

    <div
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto max-h-[calc(100vh-400px)] min-h-[400px]"
    >
        <table class="w-full text-left border-separate border-spacing-0">
            <thead class="sticky top-0 z-10 bg-white">
                <tr
                    class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                >
                    <th class="px-6 py-4 border-b border-gray-100">Customer</th>
                    <th class="px-6 py-4 border-b border-gray-100">Contact</th>
                    <th class="px-6 py-4 border-b border-gray-100">Items</th>
                    <th class="px-6 py-4 border-b border-gray-100">Amount</th>
                    <th class="px-6 py-4 text-center border-b border-gray-100"
                        >Actions</th
                    >
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                {#each filteredOrders as order}
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <div
                                    class="text-sm font-semibold text-gray-900"
                                >
                                    {order.customerName}
                                </div>
                                <span
                                    class="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase {order.status ===
                                    'fulfilled'
                                        ? 'bg-green-50 text-green-600'
                                        : order.status === 'dispatched'
                                          ? 'bg-blue-50 text-blue-600'
                                          : order.status === 'spam'
                                            ? 'bg-gray-100 text-gray-500'
                                            : 'bg-orange-50 text-orange-600'}"
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div class="text-[10px] text-gray-400">
                                {order.createdAt
                                    ? parseDate(
                                          order.createdAt,
                                      ).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : "Recently"}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-xs">
                            <div class="text-gray-700">{order.email}</div>
                            <div class="text-gray-400">{order.phone ?? ""}</div>
                        </td>
                        <td class="px-6 py-4 text-xs text-gray-500">
                            <div class="space-y-1">
                                {#each JSON.parse(order.itemsJson) as item}
                                    <div class="flex items-center gap-1.5">
                                        <span
                                            class="font-semibold text-gray-700"
                                            >{item.name}</span
                                        >
                                        {#if item.volume}
                                            <span
                                                class="text-[10px] text-gray-400"
                                                >({item.volume})</span
                                            >
                                        {/if}
                                        <span class="text-brand-600 font-bold"
                                            >x{item.quantity}</span
                                        >
                                    </div>
                                {/each}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm font-bold text-gray-900">
                            ₹{(order.total ?? 0).toFixed(0)}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center justify-center gap-2">
                                {#if order.status === "pending"}
                                    <button
                                        on:click={() =>
                                            updateStatus(
                                                order.id,
                                                "dispatched",
                                            )}
                                        class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Mark as Dispatched"
                                    >
                                        🚚
                                    </button>
                                {/if}
                                {#if order.status !== "fulfilled"}
                                    <button
                                        on:click={() =>
                                            updateStatus(order.id, "fulfilled")}
                                        class="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Mark as Fulfilled"
                                    >
                                        ✅
                                    </button>
                                {/if}
                                {#if order.status !== "spam"}
                                    <button
                                        on:click={() =>
                                            updateStatus(order.id, "spam")}
                                        class="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Mark as Spam"
                                    >
                                        🚫
                                    </button>
                                {/if}
                                {#if order.status !== "pending"}
                                    <button
                                        on:click={() =>
                                            updateStatus(order.id, "pending")}
                                        class="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                        title="Mark as Pending"
                                    >
                                        ⏳
                                    </button>
                                {/if}
                            </div>
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="text-gray-400 text-sm">
                                No {currentFilter !== "all"
                                    ? currentFilter
                                    : ""} orders found.
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
