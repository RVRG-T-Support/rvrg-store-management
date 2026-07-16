//======================================================
// RVRG STORE MANAGEMENT ENTERPRISE
//------------------------------------------------------
// Module : M29
// File   : request_approval.js
// Version: 1.0
//======================================================

/*

Reference Map

M29J-01  Initialization

M29J-02  Load Requests

M29J-03  Search

M29J-04  View Request

M29J-05  Approve Request

M29J-06  Reject Request

M29J-07  Refresh

*/

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

let selectedRequest = null;

window.onload = async function(){

await loadRequests();

};

// =====================================
// M29J-02 : LOAD REQUESTS
// =====================================

async function loadRequests(){

const status =
document.getElementById(
"searchStatus"
).value;

const ticket =
document.getElementById(
"searchTicket"
).value.trim();

let query =
supabaseClient
.from("material_requests")
.select(`
id,
ticket_no,
location_name,
technician_id,
requested_qty,
request_status,
remarks,
materials(
material_code,
material_name
),
technicians(
technician_name
)
`)
.order(
"id",
{ascending:false}
);

if(status!=""){

query =
query.eq(
"request_status",
status
);

}

if(ticket!=""){

query =
query.ilike(
"ticket_no",
"%"+ticket+"%"
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
"#requestTable tbody"
);

tbody.innerHTML="";

data.forEach(item=>{

tbody.innerHTML +=

`
<tr>

<td>

${item.ticket_no}

</td>

<td>

${item.location_name}

</td>

<td>

${item.technicians?.technician_name ?? ""}

</td>

<td>

${item.materials?.material_name ?? ""}

</td>

<td>

${item.requested_qty}

</td>

<td>

${item.request_status}

</td>

<td>

<button
onclick="viewRequest(${item.id})">

VIEW

</button>

</td>

</tr>

`;

});

}
