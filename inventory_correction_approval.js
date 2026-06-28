async function loadCorrections() {

    const tableBody = document.querySelector("#correctionTable tbody");

    tableBody.innerHTML = "";

    const { data, error } = await supabase
        .from("inventory_correction")
        .select(`
            *,
            materials(material_name),
            users_master(full_name)
        `)
        .eq("status", "PENDING")
        .order("created_at", { ascending: false });

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

            <td>${item.adjustment_type}</td>

            <td>${item.adjustment_qty}</td>

            <td>${item.reason}</td>

            <td>${item.remarks ?? ""}</td>

            <td>${item.users_master?.full_name ?? ""}</td>

            <td>${new Date(item.created_at).toLocaleDateString()}</td>

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
