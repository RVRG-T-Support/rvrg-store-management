
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadPendingRequests();

async function loadPendingRequests() {

    const { data, error } =
        await supabaseClient
        .from("material_requests")
        .select(`
            *,

            materials(

            material_code,

            material_name,

            unit_cost,

            department_id,

            departments(

            department_name

            )

            )

        `)
        .eq("request_status", "PENDING")
        .order("created_at");

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.querySelector("#pendingTable tbody");

    tbody.innerHTML = "";

    data.forEach(req => {

        tbody.innerHTML += `
        <tr>

            <td>${req.ticket_no}</td>

            <td>${req.location_name}</td>

            <td>

        ${req.materials.departments.department_name}

            </td>

            <td>

        ${req.materials.material_name}

            <br>

            <small>

        (${req.materials.material_code})

            </small>

            </td>

            <td>

        ${req.requested_qty}

    </td>

    <td>

    ₹${Number(
    req.materials.unit_cost
    ).toFixed(2)}

    </td>

    <td>

    ₹${(

    Number(req.requested_qty)

*

Number(req.materials.unit_cost)

).toFixed(2)}

</td>

<td>

${req.request_status}

</td>

            <td>

                <button
                    onclick="approveRequest(${req.id})">
                    Approve
                </button>

                <button
                    onclick="rejectRequest(${req.id})">
                    Reject
                </button>

            </td>

        </tr>
        `;

    });

}

async function approveRequest(id) {

    const { error } =
        await supabaseClient
        .from("material_requests")
        .update({
            request_status: "APPROVED",
            approved_by: 1,
            approval_date:
                new Date().toISOString()
        })
        .eq("id", id);

    if (error) {

    alert(error.message);

    return;

}

alert(

"✅ Material Request Approved Successfully"

);

loadPendingRequests();

}

async function rejectRequest(id) {

    const { error } =
        await supabaseClient
        .from("material_requests")
        .update({
            request_status: "REJECTED",
            approved_by: 1,
            approval_date:
                new Date().toISOString()
        })
        .eq("id", id);

    if (error) {

    alert(error.message);

    return;

}

alert(

"❌ Material Request Rejected"

);

loadPendingRequests();

}
