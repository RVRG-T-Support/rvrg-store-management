const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

async function loadCorrections() {

    const tableBody = document.querySelector("#approvalTable tbody");

    tableBody.innerHTML = "";

    const { data, error } = await client
        .from("inventory_correction_requests")
        .select(`
            *,
            materials(material_name)
        `)
        .eq("request_status", "PENDING")
        .order("requested_at", { ascending: false });

    if (error) {
        alert(error.message);
        return;
    }

    if (!data || data.length === 0) {

        tableBody.innerHTML = `
        <tr>
            <td colspan="11" align="center">
                No Pending Inventory Correction Requests
            </td>
        </tr>`;
        return;
    }

    data.forEach(item => {

        let newStock = Number(item.current_stock);

        if (item.correction_type === "INCREASE") {

            newStock += Number(item.quantity);

        } else {

            newStock -= Number(item.quantity);

        }

        tableBody.innerHTML += `

        <tr>

            <td>${item.icr_number}</td>

            <td>${item.materials?.material_name ?? "-"}</td>

            <td align="center">${item.current_stock}</td>

            <td>${item.correction_type}</td>

            <td align="center">${item.quantity}</td>

            <td align="center"><b>${newStock}</b></td>

            <td>${item.reason}</td>

            <td>${item.requested_by}</td>

            <td>${new Date(item.requested_at).toLocaleDateString()}</td>

            <td>

                <input
                    type="text"
                    id="comment_${item.id}"
                    placeholder="Optional Comment">

            </td>

            <td>

                <button onclick="approveCorrection(${item.id})">
                    Approve
                </button>

                <br><br>

                <button onclick="rejectCorrection(${item.id})">
                    Reject
                </button>

            </td>

        </tr>

        `;

    });

}

async function loadHistory() {

    const tableBody = document.querySelector("#historyTable tbody");

    tableBody.innerHTML = "";

    const { data, error } = await client
        .from("inventory_correction_requests")
        .select(`
            *,
            materials(material_name)
        `)
        .neq("request_status","PENDING")
        .order("approved_at",{ascending:false});

    if(error){

        alert(error.message);
        return;

    }

    data.forEach(item=>{

        tableBody.innerHTML+=`

        <tr>

            <td>${item.icr_number}</td>

            <td>${item.materials?.material_name ?? "-"}</td>

            <td>${item.request_status}</td>

            <td>${item.approved_by ?? "-"}</td>

            <td>${
                item.approved_at
                ?
                new Date(item.approved_at).toLocaleDateString()
                :
                "-"
            }</td>

            <td>${item.approval_comment ?? ""}</td>

        </tr>

        `;

    });

}

window.onload = () => {

    loadCorrections();

    loadHistory();

};

async function approveCorrection(id) {

    if (!confirm("Approve this Inventory Correction Request?")) {
        return;
    }

    const comment =
        document.getElementById(`comment_${id}`).value;

    // Get Request

    const { data: request, error: requestError } = await client
        .from("inventory_correction_requests")
        .select("*")
        .eq("id", id)
        .single();

    if (requestError) {

        alert(requestError.message);
        return;

    }

    let newStock;

    if (request.correction_type === "INCREASE") {

        newStock =
            Number(request.current_stock) +
            Number(request.quantity);

    } else {

        newStock =
            Number(request.current_stock) -
            Number(request.quantity);

    }

    // Update Material Stock

   const { error: ledgerError } = await client
.from("stock_ledger")
.insert({

    material_id: request.material_id,

    transaction_type:
        request.correction_type === "INCREASE"
        ? "STOCK_IN"
        : "STOCK_OUT",

    quantity: request.quantity,

    reference_no: request.icr_number,

    remarks:
        "Inventory Correction",

    created_by: 1,

    created_at: new Date(),

    transaction_date:
        new Date().toISOString().split("T")[0],

    request_id: request.id

});
    // Stock Ledger Entry

    
    if (ledgerError) {

        alert(ledgerError.message);
        return;

    }

    // Update Request

    const { error: approveError } = await client
        .from("inventory_correction_requests")
        .update({

            request_status: "APPROVED",

            approved_by: "FM",

            approved_at: new Date(),

            approval_comment: comment

        })
        .eq("id", id);

    if (approveError) {

        alert(approveError.message);
        return;

    }

    alert("Inventory Correction Approved.");

    loadCorrections();

    loadHistory();

}

async function rejectCorrection(id) {

    const comment =
        document.getElementById(`comment_${id}`).value;

    const { error } = await client
        .from("inventory_correction_requests")
        .update({

            request_status: "REJECTED",

            approved_by: "FM",

            approved_at: new Date(),

            approval_comment: comment

        })
        .eq("id", id);

    if (error) {

        alert(error.message);
        return;

    }

    alert("Inventory Correction Rejected.");

    loadCorrections();

    loadHistory();

}
