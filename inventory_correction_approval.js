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

function approveCorrection(id){

    alert("M15-03");

}

function rejectCorrection(id){

    alert("M15-04");

}
