//======================================================
// RVRG STORE MANAGEMENT ENTERPRISE
//------------------------------------------------------
// Module : M29
// File   : approval.js
// Version: 1.0
//======================================================

/*

Reference Map

APJ-01 Initialization

APJ-02 Load Requests

APJ-03 View Request

APJ-04 Load Details

APJ-05 Approve

APJ-06 Reject

APJ-07 Refresh

*/

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

let selectedRequestId = null;

window.onload = async function(){

await loadPendingRequests();

}

// =====================================
// APJ-02 : LOAD REQUESTS
// =====================================

async function loadPendingRequests(){

const status =
document.getElementById(
"statusFilter"
).value;

const search =
document.getElementById(
"searchText"
).value.trim();

let query =
supabaseClient
.from("material_requests")
.select("*")
.eq("status",status)
.order("request_date",{
ascending:false
});

if(search!=""){

query =
query.or(

`request_no.ilike.%${search}%,

ticket_no.ilike.%${search}%`

);

}

const {data,error} =
await query;

if(error){

alert(error.message);

return;

}

const tbody =
document.querySelector(
"#approvalTable tbody"
);

tbody.innerHTML="";

data.forEach(item=>{

tbody.insertAdjacentHTML(

"beforeend",

`

<tr>

<td>

${item.request_no}

</td>

<td>

${item.ticket_no}

</td>

<td>

${item.location_name}

</td>

<td>

${item.technician_name}

</td>

<td>

${item.priority}

</td>

<td>

${item.request_date}

</td>

<td>

${item.status}

</td>

<td>

<button

onclick="viewRequest(${item.id})">

OPEN

</button>

</td>

</tr>

`

);

});

}

// =====================================
// APJ-03 : VIEW REQUEST
// =====================================

async function viewRequest(id){

selectedRequestId = id;

await loadRequestDetails();

}

// =====================================
// APJ-04 : LOAD DETAILS
// =====================================

async function loadRequestDetails(){

const tbody =
document.querySelector(
"#detailTable tbody"
);

tbody.innerHTML="";

const {data,error} =
await supabaseClient
.from("material_request_details")
.select(`
requested_qty,
remarks,
materials(
material_code,
material_name
)
`)
.eq(
"request_id",
selectedRequestId
);

if(error){

alert(error.message);

return;

}

data.forEach(item=>{

tbody.insertAdjacentHTML(

"beforeend",

`

<tr>

<td>

${item.materials.material_code}

-

${item.materials.material_name}

</td>

<td>

${item.requested_qty}

</td>

<td>

${item.remarks}

</td>

</tr>

`

);

});

}
