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
