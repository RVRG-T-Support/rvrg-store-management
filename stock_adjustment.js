const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadAdjustmentMaterials();

async function loadAdjustmentMaterials() {

    const { data } =
        await supabaseClient
        .from("materials")
        .select("id, material_code, material_name")
        .order("material_code");

    const select =
        document.getElementById(
            "adjustMaterial"
        );

    select.innerHTML =
        '<option value="">Select Material</option>';

    data.forEach(item => {

        select.innerHTML += `
        <option value="${item.id}">
        ${item.material_code}
        -
        ${item.material_name}
        </option>
        `;

    });

}

async function saveAdjustment() {

    const materialId =
        document.getElementById(
            "adjustMaterial"
        ).value;

    const type =
        document.getElementById(
            "adjustType"
        ).value;

    const qty =
        parseFloat(
            document.getElementById(
                "adjustQty"
            ).value
        );

    const reason =
        document.getElementById(
            "adjustReason"
        ).value;

    const remarks =
        document.getElementById(
            "adjustRemarks"
        ).value;

    if (!materialId || !qty) {

        alert(
            "Material and Quantity required"
        );

        return;

    }

    await supabaseClient
        .from("stock_adjustments")
        .insert([
            {
                material_id: materialId,
                adjustment_type: type,
                quantity: qty,
                reason: reason,
                remarks: remarks,
                approved_by: 1
            }
        ]);

    await supabaseClient
        .from("stock_ledger")
        .insert([
            {
                material_id: materialId,
                transaction_type:
                    "ADJUSTMENT",
                quantity:
                    type === "DECREASE"
                    ? -qty
                    : qty,
                remarks:
                    "Stock Adjustment",
                created_by: 1
            }
        ]);

    alert(
        "Adjustment Saved"
    );

}
