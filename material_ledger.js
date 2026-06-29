
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadMaterials();

async function loadMaterials() {

    const { data, error } =
        await supabaseClient
        .from("materials")
        .select("id, material_code, material_name")
        .order("material_code");

    if (error) {
        console.error(error);
        return;
    }

    const select = document.getElementById("ledgerMaterial");

    select.innerHTML =
        '<option value="">Select Material</option>';

    data.forEach(item => {

        select.innerHTML += `
        <option value="${item.id}">
            ${item.material_code} - ${item.material_name}
        </option>`;

    });

}

async function loadLedger() {

    const materialId =
        document.getElementById("ledgerMaterial").value;

    if (!materialId) {

        alert("Select Material");
        return;

    }

    const { data, error } =
        await supabaseClient
        .from("stock_ledger")
        .select("*")
        .eq("material_id", materialId)
        .order("created_at", { ascending: true });

    if (error) {

        console.error(error);
        return;

    }

    const tbody =
        document.querySelector("#ledgerTable tbody");

    tbody.innerHTML = "";

    let balance = 0;

    data.forEach(item => {

        if (
            item.transaction_type === "STOCK_IN" ||
            item.transaction_type === "RETURN"
        ) {

            balance += Number(item.quantity);

        }
        else if (
            item.transaction_type === "ISSUE"
        ) {

            balance -= Number(item.quantity);

        }
        else if (
            item.transaction_type === "ADJUSTMENT"
        ) {

            balance += Number(item.quantity);

        }

        tbody.innerHTML += `
        <tr>

            <td>${item.transaction_date ?? ""}</td>

            <td>${item.transaction_type}</td>

            <td>${item.quantity}</td>

            <td>${item.reference_no ?? ""}</td>

            <td>${item.remarks ?? ""}</td>

            <td>${balance}</td>

        </tr>`;
    });

}

async function searchLedger() {

    const materialId =
        document.getElementById("ledgerMaterial").value;

    if (!materialId) {

        alert("Select Material");
        return;

    }

    const keyword =
        document.getElementById("ledgerSearch")
        .value
        .trim()
        .toLowerCase();

    const type =
        document.getElementById("ledgerType").value;

    let query =
        supabaseClient
        .from("stock_ledger")
        .select("*")
        .eq("material_id", materialId);

    if (type !== "") {

        query = query.eq(
            "transaction_type",
            type
        );

    }

    const { data, error } =
        await query.order(
            "created_at",
            { ascending: true }
        );

    if (error) {

        console.error(error);
        return;

    }

    const filtered =
        data.filter(item => {

            const ref =
                (item.reference_no ?? "")
                .toLowerCase();

            return ref.includes(keyword);

        });

    renderLedger(filtered);

}
