const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadCurrentStock();

async function loadCurrentStock() {

    const { data, error } =
        await supabaseClient
        .from("current_stock")
        .select("*")
        .order("material_code");

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.querySelector(
            "#stockReportTable tbody"
        );

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `
        <tr>
            <td>${item.material_code}</td>
            <td>${item.material_name}</td>
            <td>${item.department_name}</td>
            <td>${item.current_stock}</td>
            <td>${item.unit}</td>
        </tr>
        `;

    });

}

async function loadStockMovement() {

    const fromDate =
        document.getElementById("fromDate").value;

    const toDate =
        document.getElementById("toDate").value;

    if (!fromDate || !toDate) {

        alert("Select From Date and To Date");
        return;

    }

    const { data, error } =
        await supabaseClient
        .from("stock_ledger")
        .select(`
            *,
            materials (
                material_code,
                material_name
            )
        `)
        .gte("transaction_date", fromDate)
        .lte("transaction_date", toDate)
        .order("transaction_date");

    if (error) {

        alert(error.message);
        return;

    }

    const tbody =
        document.querySelector(
            "#movementTable tbody"
        );

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `
        <tr>
            <td>${item.transaction_date}</td>

            <td>
                ${item.materials ?
                    item.materials.material_code + " - " +
                    item.materials.material_name
                    : ""}
            </td>

            <td>${item.transaction_type}</td>

            <td>${item.quantity}</td>

            <td>${item.reference_no || ""}</td>

        </tr>
        `;

    });

}
