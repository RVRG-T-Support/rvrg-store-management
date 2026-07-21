// ======================================================
// RVRG STORE MANAGEMENT SYSTEM
// File      : issue.js
// Version   : V2.1
// Module    : Material Issue
// ======================================================

// ======================================================
// GLOBAL VARIABLES
// ======================================================

const issueTableBody =
    document.getElementById("issueTableBody");

let approvedRequests = [];

// ======================================================
// INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeIssuePage();

});

// ======================================================
// INITIALIZE PAGE
// ======================================================

async function initializeIssuePage() {

    showLoader();

    await loadApprovedRequests();

    hideLoader();

}

// ======================================================
// LOAD APPROVED REQUESTS
// ======================================================

async function loadApprovedRequests() {

    issueTableBody.innerHTML = `
        <tr>
            <td colspan="13" align="center">
                Loading...
            </td>
        </tr>
    `;

    try {

        const { data, error } =
            await supabaseClient

                .from("material_requests")

                .select(`
                    id,
                    ticket_no,
                    location_name,
                    location_type,
                    requested_qty,
                    issued_qty,
                    request_status,
                    created_at,

                    technicians(
                        technician_name
                    ),

                    materials(
                        material_id,
                        material_name,
                        material_code,
                        unit_cost,

                        departments(
                            department_name
                        )
                    )
                `)

                .in("request_status",
                    [
                        "APPROVED",
                        "PARTIALLY_ISSUED"
                    ])

                .order("created_at", {
                    ascending: false
                });

        if (error)
            throw error;

        approvedRequests = data || [];

        await renderIssueTable();

    }

    catch (error) {

        logError(error);

        issueTableBody.innerHTML = `
            <tr>
                <td colspan="13" align="center">
                    Failed to load data.
                </td>
            </tr>
        `;

    }

}

// ======================================================
// RENDER TABLE
// ======================================================

async function renderIssueTable() {

    issueTableBody.innerHTML = "";

    if (approvedRequests.length === 0) {

        issueTableBody.innerHTML = `
            <tr>
                <td colspan="13" align="center">
                    No Approved Requests
                </td>
            </tr>
        `;

        return;

    }

    for (const request of approvedRequests) {

        const stock =
            await getCurrentStock(
                request.materials.material_id
            );

        const requested =
            Number(request.requested_qty || 0);

        const issued =
            Number(request.issued_qty || 0);

        const balance =
            requested - issued;

        const unitCost =
            Number(
                request.materials.unit_cost || 0
            );

        const amount =
            balance * unitCost;

        issueTableBody.innerHTML += `

<tr>

<td>${formatDate(request.created_at)}</td>

<td>${request.ticket_no}</td>

<td>${request.location_name}</td>

<td>${request.materials.departments.department_name}</td>

<td>
${request.materials.material_code}
<br>
${request.materials.material_name}
</td>

<td>${requested}</td>

<td>${issued}</td>

<td>${balance}</td>

<td>${formatCurrency(unitCost)}</td>

<td>${formatCurrency(amount)}</td>

<td>

<input
type="number"
min="1"
max="${balance}"
id="issueQty_${request.id}"
style="width:70px;">

</td>

<td>

<button
onclick="issueMaterial(${request.id})">

Issue

</button>

</td>

<td>

${stock}

</td>

</tr>

`;

    }

}

// ======================================================
// GET CURRENT STOCK
// ======================================================

async function getCurrentStock(materialId) {

    const { data, error } =
        await supabaseClient

            .from("current_stock")

            .select("current_stock")

            .eq("material_id", materialId)

            .single();

    if (error || !data)
        return 0;

    return Number(data.current_stock);

}
