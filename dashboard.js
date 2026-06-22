const dashboardClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadDashboard();
loadInventoryValue();

async function loadDashboard() {

    const { count: materialCount } =
        await dashboardClient
        .from("materials")
        .select("*", {
            count: "exact",
            head: true
        });

    document.getElementById(
        "totalMaterials"
    ).innerText = materialCount || 0;

    const { count: lowStockCount } =
        await dashboardClient
        .from("low_stock_alerts")
        .select("*", {
            count: "exact",
            head: true
        });

    document.getElementById(
        "lowStockCount"
    ).innerText = lowStockCount || 0;

    const { count: pendingCount } =
        await dashboardClient
        .from("material_requests")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("request_status", "PENDING");

    document.getElementById(
        "pendingCount"
    ).innerText = pendingCount || 0;

    const { count: approvedCount } =
        await dashboardClient
        .from("material_requests")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("request_status", "APPROVED");

    document.getElementById(
        "approvedCount"
    ).innerText = approvedCount || 0;

    const { count: issuedCount } =
        await dashboardClient
        .from("material_requests")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("request_status", "ISSUED");

    document.getElementById(
        "issuedCount"
    ).innerText = issuedCount || 0;

}

async function loadInventoryValue() {

    const { data, error } =
        await dashboardClient
        .from("current_stock")
        .select(`
            current_stock,
            unit_cost
        `);

    if (error) {
        console.error(error);
        return;
    }

    let totalValue = 0;

    data.forEach(item => {

        totalValue +=
            (item.current_stock || 0) *
            (item.unit_cost || 0);

    });

    document.getElementById(
        "inventoryValue"
    ).innerText =
        "₹" + totalValue.toLocaleString();

}
