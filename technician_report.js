const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadTechnicianConsumption();

async function loadTechnicianConsumption() {

    const { data, error } =
        await supabaseClient
        .from("technician_consumption")
        .select("*")
        .order("total_value", {
            ascending: false
        });

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.querySelector(
            "#technicianTable tbody"
        );

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `
        <tr>

            <td>${item.technician_name}</td>

            <td>${item.issue_transactions}</td>

            <td>${item.total_qty}</td>

            <td>₹${item.total_value}</td>

        </tr>
        `;

    });

}
