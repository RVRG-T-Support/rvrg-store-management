const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadApprovedRequests();

async function loadApprovedRequests() {

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
        .eq("request_status", "APPROVED")
        .order("created_at");

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.querySelector("#issueTable tbody");

    tbody.innerHTML = "";

    data.forEach(req => {

        tbody.innerHTML += `
        <tr>

            <td>${req.ticket_no}</td>

            <td>${req.location_name}</td>

            <td>
                ${req.materials.material_code}
                -
                ${req.materials.material_name}
            </td>

            <td>${req.requested_qty}</td>

            <td>
                <input
                    type="number"
                    id="issue_${req.id}"
                    value="${req.requested_qty}">
            </td>

            <td>

                <button
                    onclick="issueMaterial(${req.id}, ${req.material_id})">

                    Issue

                </button>

            </td>

        </tr>
        `;

    });

}

async function issueMaterial(
    requestId,
    materialId
) {

    const issueQty =
        document.getElementById(
            `issue_${requestId}`
        ).value;

    const { data: requestData, error: requestLookupError } =
        await supabaseClient
        .from("material_requests")
        .select("ticket_no")
        .eq("id", requestId)
        .single();

    if (requestLookupError) {

        alert(requestLookupError.message);
        return;

    }

    const { error: ledgerError } =
        await supabaseClient
        .from("stock_ledger")
        .insert([
            {
                material_id: materialId,
                transaction_type: "ISSUE",
                quantity: issueQty,
                request_id: requestId,
                reference_no: requestData.ticket_no,
                remarks: "Material Issued",
                created_by: 1
            }
        ]);

    if (ledgerError) {

        alert(ledgerError.message);
        return;

    }

    const { error: requestError } =
        await supabaseClient
        .from("material_requests")
        .update({
            request_status: "ISSUED",
            issued_qty: issueQty
        })
        .eq("id", requestId);

    if (requestError) {

        alert(requestError.message);
        return;

    }

    alert("Material Issued");

    loadApprovedRequests();

}
