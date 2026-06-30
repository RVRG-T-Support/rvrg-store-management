const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

loadTodayConsumption();

async function loadTodayConsumption() {

    const tbody =
        document.querySelector("#todayTable tbody");

    tbody.innerHTML = "";

    let totalValue = 0;

    const today =
        new Date().toISOString().split("T")[0];

    const { data, error } =
        await supabaseClient
        .from("stock_ledger")
        .select(`
            *,
            materials(
                material_name,
                unit_cost
            )
        `)
        .eq("transaction_type", "ISSUE")
        .eq("transaction_date", today)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        alert(error.message);
        return;

    }

    data.forEach(item => {

        const unitCost =
            Number(item.materials?.unit_cost ?? 0);

        const value =
            Number(item.quantity) * unitCost;

        totalValue += value;

        tbody.innerHTML += `

        <tr>

            <td>${item.transaction_date}</td>

            <td>${item.materials?.material_name ?? ""}</td>

            <td>${item.quantity}</td>

            <td>${item.reference_no ?? ""}</td>

            <td>₹${value.toFixed(2)}</td>

        </tr>

        `;

    });

    document.getElementById("todayTotal").innerHTML =
        "₹" + totalValue.toFixed(2);

}
