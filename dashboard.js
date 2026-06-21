const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadDashboard();

async function loadDashboard() {

    const { count: materialCount } =
        await supabaseClient
        .from("materials")
        .select("*", {
            count: "exact",
            head: true
        });

    document.getElementById(
        "totalMaterials"
    ).innerText = materialCount || 0;

    const { count: lowStockCount } =
        await supabaseClient
        .from("low_stock_alerts")
        .select("*", {
            count: "exact",
            head: true
        });

    document.getElementById(
        "lowStockCount"
    ).innerText = lowStockCount || 0;

    const { count: pendingCount } =
        await supabaseClient
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
        await supabaseClient
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
        await supabaseClient
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
