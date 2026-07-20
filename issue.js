// =====================================
// RVRG STORE MANAGEMENT
// ISSUE MODULE V2
// M-01 : INITIAL SETUP
// =====================================
const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

// =====================================
// IS-01 : PAGE LOAD
// =====================================

window.onload = async function(){

    await loadApprovedRequests();
};

// =====================================
// IS-02 : LOAD APPROVED REQUESTS
// =====================================
async function loadApprovedRequests(){

    console.log("IS-02 Started");

    const { data, error } =
    await supabaseClient
    .from("material_requests")
    .select("*")
    .eq("request_status","APPROVED");

    console.table(data);

    console.log("Data :", data);

    console.log("Error :", error);

    const tbody =
for (const req of data) {

const balance =
Number(req.requested_qty) -
Number(req.issued_qty ?? 0);

tbody.innerHTML += `

<tr>

<td>${new Date(req.approval_date).toLocaleDateString("en-GB")}</td>

<td>${req.ticket_no}</td>

<td>${req.location_name}</td>

<td>Loading...</td>

<td>Loading...</td>

<td>${req.requested_qty}</td>

<td>${req.issued_qty}</td>

<td>${balance}</td>

<td>--</td>

<td>--</td>

<td>

<input
type="number"
value="${balance}"
min="1"
max="${balance}">

</td>

<td>

<button>

Issue

</button>

</td>

</tr>

`;

}
