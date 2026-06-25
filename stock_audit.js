const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadAudit();

async function loadAudit() {

    const { data, error } =
        await supabaseClient
        .from("stock_ledger")
        .select(`
            *,
            materials(
                material_code,
                material_name
            )
        `)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(error);
        return;

    }

    const tbody =
        document.querySelector("#auditTable tbody");

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `

        <tr>

        <td>${item.transaction_date ?? ""}</td>

        <td>

        ${item.materials.material_code}

        -

        ${item.materials.material_name}

        </td>

        <td>${item.transaction_type}</td>

        <td>${item.quantity}</td>

        <td>${item.reference_no ?? ""}</td>

        <td>${item.remarks ?? ""}</td>

        </tr>

        `;

    });

}
