const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadMaterials();

async function loadMaterials() {

    const { data, error } =
        await supabaseClient
        .from("current_stock")
        .select(`
            material_id,
            material_code,
            material_name,
            current_stock
        `)
        .order("material_code");

    if (error) {

        console.error(error);
        return;

    }

    const select =
        document.getElementById(
            "correctionMaterial"
        );

    select.innerHTML =
        '<option value="">Select Material</option>';

    data.forEach(item => {

        select.innerHTML += `
        <option
            value="${item.material_id}"
            data-stock="${item.current_stock}">

            ${item.material_code} - ${item.material_name}

        </option>
        `;

    });

}

document
.getElementById("correctionMaterial")
.addEventListener("change", function () {

    const stock =
        this.options[this.selectedIndex]
        .dataset.stock;

    document.getElementById(
        "currentStock"
    ).value = stock || 0;

});

async function submitCorrection() {

    const materialId =
        document.getElementById(
            "correctionMaterial"
        ).value;

    const currentStock =
        document.getElementById(
            "currentStock"
        ).value;

    const type =
        document.getElementById(
            "correctionType"
        ).value;

    const qty =
        document.getElementById(
            "correctionQty"
        ).value;

    const reason =
        document.getElementById(
            "reason"
        ).value;

    const remarks =
        document.getElementById(
            "remarks"
        ).value;

    if (!materialId || !qty || !reason) {

        alert(
            "Please complete all required fields."
        );

        return;

    }

    const { error } =
        await supabaseClient
        .from("inventory_correction_requests")
        .insert([
            {
                material_id: materialId,
                correction_type: type,
                quantity: qty,
                current_stock: currentStock,
                reason: reason,
                remarks: remarks,
                request_status: "PENDING",
                requested_by: "Store Keeper"
            }
        ]);

    if (error) {

        alert(error.message);
        return;

    }

    alert(
        "Inventory Correction Request Submitted Successfully"
    );

    location.reload();

}
