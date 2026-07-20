// =====================================
// IS-02 : LOAD APPROVED REQUESTS
// =====================================

async function loadApprovedRequests() {

    const { data, error } =
    await supabaseClient
    .from("material_requests")
   .select(`
id,
request_date,
ticket_no,
location_name,
technician_id,
material_id,
requested_qty,
issued_qty,
request_status,

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
    .eq("request_status","APPROVED")
    .order("created_at");

    if(error){

        console.error(error);

        alert(error.message);

        return;

    }

    const tbody =
    document.querySelector(
    "#issueTable tbody"
    );

    tbody.innerHTML = "";

    data.forEach(req=>{

        const requestedQty =
        Number(req.requested_qty);

        const issuedQty =
        Number(req.issued_qty ?? 0);

        const balanceQty =
        requestedQty - issuedQty;

        const unitCost =
        Number(req.materials?.unit_cost ?? 0);

        const amount =
        balanceQty * unitCost;

        tbody.innerHTML += `

<tr>

<td>

${new Date(
req.request_date
).toLocaleDateString("en-GB")}

</td>

<td>${req.ticket_no}</td>

<td>${req.location_name}</td>

<td>${req.materials?.departments?.department_name ?? "-"}</td>

<td>

${req.materials?.material_name ?? ""}

<br>

<small>

(${req.materials?.material_code ?? ""})

</small>

</td>

<td>${requestedQty}</td>

<td>${issuedQty}</td>

<td>${balanceQty}</td>

<td>₹${unitCost.toFixed(2)}</td>

<td>₹${amount.toFixed(2)}</td>

<td>

<input
type="number"
id="issue_${req.id}"
value="${balanceQty}"
min="1"
max="${balanceQty}">

</td>

<td>

<button
onclick="issueMaterial(${req.id},${req.material_id})">

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
    const { data: stockData, error: stockError } =
    await supabaseClient
    .from("current_stock")
    .select("current_stock")
    .eq("material_id", materialId)
    .single();

if (stockError) {

    alert(stockError.message);
    return;

}

if (Number(issueQty) > Number(stockData.current_stock)) {

    alert(
        "Insufficient Stock!\n\nAvailable : "
        + stockData.current_stock
    );

    return;

}

    const { data: requestData, error: requestLookupError } =
    await supabaseClient
    .from("material_requests")
 .select(`
request_date,
ticket_no,
location_name,
technician_id,
material_id,
requested_qty,
issued_qty,

materials(
unit_cost
)
`)
    .eq("id", requestId)
    .single();
    const balanceQty =
Number(requestData.requested_qty) -
Number(requestData.issued_qty ?? 0);

if(Number(issueQty) > balanceQty){

alert(

"Cannot issue more than approved quantity."

);

return;

}

    // Save Issue Register

const unitCost =
    Number(requestData.materials?.unit_cost ?? 0);

const totalCost =
    Number(issueQty) * unitCost;

const { count } =
    await supabaseClient
    .from("material_issue_register")
    .select("*", {
        count: "exact",
        head: true
    });

const issueNumber =
    "MI-" +
    String((count ?? 0) + 1).padStart(5, "0");

const { error: issueRegisterError } =
    await supabaseClient
    .from("material_issue_register")
    .insert({

        issue_number: issueNumber,

        request_id: requestId,

        material_id: materialId,

        ticket_no: requestData.ticket_no,

        location_name: requestData.location_name,

 technician_id: requestData.technician_id,

issued_qty: Number(issueQty),

unit_cost: unitCost,

total_cost: totalCost,

issued_by: "Store Keeper",

remarks: "Material Issued"

});
    
if (issueRegisterError) {

    alert(issueRegisterError.message);
    return;

}

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
// =====================================
// IS-05 : UPDATE REQUEST
// =====================================

const newIssuedQty =
Number(requestData.issued_qty ?? 0)
+
Number(issueQty);

const newStatus =
newIssuedQty >= Number(requestData.requested_qty)
?
"ISSUED"
:
"PARTIAL";

const { error: requestError } =
await supabaseClient
.from("material_requests")
.update({

request_status: newStatus,

issued_qty: newIssuedQty

})
.eq("id", requestId);

   const newIssuedQty =
Number(requestData.issued_qty ?? 0)
+
Number(issueQty);

const newStatus =
newIssuedQty >= Number(requestData.requested_qty)
? "ISSUED"
: "PARTIAL";

const { error: requestError } =
await supabaseClient
.from("material_requests")
.update({

request_status: newStatus,

issued_qty: newIssuedQty

})
.eq("id", requestId);

    if (requestError) {

        alert(requestError.message);
        return;

    }

    alert(

"✅ Material Issued Successfully\n\n"+ .

"Ticket : "+

requestData.ticket_no+

"\nIssued Qty : "+

issueQty+

"\nStatus : "+

newStatus

);

    loadApprovedRequests();
    return;

}
