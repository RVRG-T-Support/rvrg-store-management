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
        .order("requested_at", { ascending:false })

    if (error) {

        alert(error.message);
        return;

    }

    data.forEach(item => {

        tableBody.innerHTML += `

        <tr>

            <td>${item.icr_number ?? "-"}</td>

            <td>${item.materials?.material_name ?? ""}</td>

            <td>${item.current_stock}</td>

            <td>${item.correction_type}</td>

            <td>${item.quantity}</td>
            
            <td>
            ${
            item.correction_type==="INCREASE"
            ?
            Number(item.current_stock)+Number(item.quantity)
            :
            Number(item.current_stock)-Number(item.quantity)
            }
            </td>

            <td>${item.reason}</td>

            <td>${item.remarks ?? ""}</td>

            <td>${item.requested_by}</td>

            <td>new Date(item.requested_at).toLocaleDateString()}</td>

            <td>

                <input
                    type="text"
                    id="comment_${item.id}"
                    placeholder="Optional">

            </td>

            <td>

                <button onclick="approveCorrection(${item.id})">

                    Approve

                </button>

                <button onclick="rejectCorrection(${item.id})">

                    Reject

                </button>

            </td>

        </tr>

        `;

    });

}

window.onload = loadCorrections;

function approveCorrection(id){

    alert("M15-03");

}

function rejectCorrection(id){

    alert("M15-04");

}
