const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadIssuedRequests();

async function loadIssuedRequests() {

    const { data, error } =
        await supabaseClient
        .from("material_requests")
        .select(`
            *,
            materials (
                material_code,
                material_name
            )
        `)
        .eq("request_status", "ISSUED")
        .order("created_at");

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.querySelector("#returnTable tbody");

    tbody.innerHTML = "";

    data.forEach(req => {

        const balanceQty =
            (req.issued_qty || 0) -
            (req.returned_qty || 0);

        if (balanceQty <= 0) {
            return;
        }

        tbody.innerHTML += `
        <tr>

            <td>${req.ticket_no}</td>

            <td>${req.location_name}</td>

            <td>
                ${req.materials.material_code}
                -
                ${req.materials.material_name}
            </td>

            <td>${balanceQty}</td>

            <td>
                <input
                    type="number"
                    id="return_${req.id}"
                    value="1"
                    min="1"
                    max="${balanceQty}">
            </td>

            <td>

                <button
                    onclick="returnMaterial(
                        ${req.id},
                        ${req.material_id},
                        ${balanceQty}
                    )">

                    Return

                </button>

            </td>

        </tr>
        `;

    });

}

async function returnMaterial(
    requestId,
    materialId,
    balanceQty
) {

    const returnQty =
        parseFloat(
            document.getElementById(
                `return_${requestId}`
            ).value
        );

    if (
        !returnQty ||
        returnQty <= 0 ||
        returnQty > balanceQty
    ) {

        alert(
            "Invalid Return Quantity"
        );

        return;
    }

    const { error: ledgerError } =
        await supabaseClient
        .from("stock_ledger")
        .insert([
            {
                material_id: materialId,
                transaction_type: "RETURN",
                quantity: returnQty,
                request_id: requestId,
                remarks: "Material Returned",
                created_by: 1
            }
        ]);

    if (ledgerError) {

        alert(ledgerError.message);
        return;

    }

    const { data: requestData } =
        await supabaseClient
        .from("material_requests")
        .select("returned_qty")
        .eq("id", requestId)
        .single();

    const existingReturned =
        requestData.returned_qty || 0;

    const totalReturned =
        existingReturned + returnQty;

    const { error: updateError } =
        await supabaseClient
        .from("material_requests")
        .update({
            returned_qty: totalReturned
        })
        .eq("id", requestId);

    if (updateError) {

        alert(updateError.message);
        return;

    }

    alert("Material Returned");

    loadIssuedRequests();

}
