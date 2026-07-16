//======================================================
// RVRG STORE MANAGEMENT ENTERPRISE
//------------------------------------------------------
// Module : M28
// File   : material_request.js
// Version: 1.0
//======================================================

/*

Reference Map

MR-02A Initialization

MR-02B Load Technicians

MR-02C Load Materials

MR-04 Add Row

MR-05 Material Changed

MR-06 Update Summary

MR-07 Validation

MR-08 Save Request

MR-09 Reset Form

MR-10 Enter Navigation

*/

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

let rowIndex = 0;

// =====================================
// MR-02B : PAGE LOAD
// =====================================

window.onload = async function(){

document.getElementById(
"requestDate"
).value =
new Date()
.toISOString()
.split("T")[0];

await loadTechnicians();

await addRow();

}

// =====================================
// MRJ-02C : LOAD TECHNICIANS
// =====================================

async function loadTechnicians(){

const {data,error} =
await supabaseClient
.from("technicians")
.select("*")
.eq("is_active",true)
.order("technician_name");

if(error){

alert(error.message);

return;

}

const tech =
document.getElementById(
"technician"
);

tech.innerHTML =
'<option value="">Select Technician</option>';

data.forEach(item=>{

tech.innerHTML +=

`

<option value="${item.id}">

${item.technician_name}

</option>

`;

});

}

// =====================================
// MR-04 : ADD ROW
// =====================================

async function loadMaterialOptions(){

const {data,error} =
await supabaseClient
.from("materials")
.select(`
id,
material_code,
material_name,
unit
`)
.eq("is_active", true)
.order("material_code");

if(error){

alert(error.message);

return "";

}

let options =
'<option value="">Select Material</option>';

data.forEach(item=>{

options +=

`

<option
value="${item.id}">

${item.material_code}

-

${item.material_name}

</option>

`;

});

return options;

}

async function addRow(){

rowIndex++;

const tbody =
document.querySelector(
"#requestTable tbody"
);

const materialOptions =
await loadMaterialOptions();

tbody.insertAdjacentHTML(

"beforeend",

`

<tr id="row${rowIndex}">

<td>

<select

class="materialSelect">

${materialOptions}

</select>

</td>

<td>

<input

type="number"

class="qty"

placeholder="Qty"

min="1"

oninput="updateSummary()"

onkeydown="qtyEnter(event)"
>
</td>

<td>

<input

type="text"

class="remarks"

placeholder="Remarks">

</td>

<td>

<button

type="button"

onclick="deleteRow(${rowIndex})">

❌

</button>

</td>

</tr>

`

);

updateSummary();

}

// =====================================
// MR-04B : DELETE ROW
// =====================================

function deleteRow(row){

document
.getElementById(
"row"+row
)
.remove();

updateSummary();

}

// =====================================
// MR-06 : UPDATE SUMMARY
// =====================================

function updateSummary(){

const rows =
document.querySelectorAll(
"#requestTable tbody tr"
);

document.getElementById(
"totalItems"
).innerText =
rows.length;

let qty=0;

rows.forEach(r=>{

qty +=

Number(

r.querySelector(".qty").value

)||0;

});

document.getElementById(
"totalQty"
).innerText=qty;

}

// =====================================
// MR-07 : VALIDATION
// =====================================

function validateRequest(){

const ticketNo =
document.getElementById(
"ticketNo"
).value.trim();

if(ticketNo==""){

alert("Please enter Ticket Number.");

document.getElementById(
"ticketNo"
).focus();

return false;

}

const technician =
Number(
document.getElementById(
"technician"
).value
);

if(technician==""){

alert("Please enter Technician Name.");

document.getElementById(
"technician"
).focus();

return false;

}

const rows =
document.querySelectorAll(
"#requestTable tbody tr"
);

if(rows.length==0){

alert("Add at least one material.");

return false;

}

for(const row of rows){

const material =
row.querySelector(".materialSelect");

const qty =
row.querySelector(".qty");

if(material.value==""){

alert("Please select material.");

material.focus();

return false;

}

if(

qty.value.trim()=="" ||

Number(qty.value)<=0

){

alert("Quantity must be greater than zero.");

qty.focus();

return false;

}

}

return true;

}

// =====================================
// MRJ-08 : SAVE REQUEST
// =====================================

async function saveRequest(){

if(!validateRequest())
return;

const ticketNo =
document.getElementById(
"ticketNo"
).value.trim();

const locationType =
document.getElementById(
"locationType"
).value;

const locationName =
document.getElementById(
"locationName"
).value.trim();

const technician =
document.getElementById(
"technician"
).value.trim();

const rows =
document.querySelectorAll(
"#requestTable tbody tr"
);

for(const row of rows){

const materialId =
Number(
row.querySelector(".materialSelect").value
);

const qty =
Number(
row.querySelector(".qty").value
);

const remarks =
row.querySelector(".remarks")
.value.trim();

const {error} =
await supabaseClient
.from("material_requests")
.insert([
{

ticket_no:ticketNo,

location_type:locationType,

location_name:locationName,

technician_id: technician,

material_id:materialId,

requested_qty:qty,

remarks:remarks,

request_status:"PENDING",

requested_by:1

}
]);

if(error){

alert(error.message);

return;

}

}

const items =
document.getElementById(
"totalItems"
).innerText;

const totalQty =
document.getElementById(
"totalQty"
).innerText;

alert(

"✅ Material Request Submitted\n\n"+

"Ticket No : "+ticketNo+

"\nItems : "+items+

"\nTotal Qty : "+totalQty+

"\nStatus : Pending Approval"

);

await resetRequest();

}

// =====================================
// MRJ-10 : RESET FORM
// =====================================

async function resetRequest(){

document.getElementById(
"ticketNo"
).value="";

document.getElementById(
"locationName"
).value="";

document.getElementById(
"technician"
).value="";

document.getElementById(
"priority"
).value="Medium";

document.querySelector(
"#requestTable tbody"
).innerHTML="";

rowIndex=0;

updateSummary();

await addRow();

document.getElementById(
"ticketNo"
).focus();

document.getElementById(
"technician"
).selectedIndex = 0;

}

// =====================================
// MRJ-11 : ENTER KEY
// =====================================

document.addEventListener(

"keydown",

function(e){

if(e.key!="Enter")
return;

const tag=
document.activeElement.tagName;

if(

tag!="INPUT" &&

tag!="SELECT"

)

return;

e.preventDefault();

const fields=
Array.from(

document.querySelectorAll(

"input,select"

)

);

const index=
fields.indexOf(
document.activeElement
);

if(

index>=0 &&

index<fields.length-1

){

fields[index+1].focus();

}

}

);

// =====================================
// MRJ-12 : AUTO ADD ROW
// =====================================

async function qtyEnter(e){

if(e.key!="Enter")
return;

e.preventDefault();

await addRow();

const rows=
document.querySelectorAll(
"#requestTable tbody tr"
);

rows[
rows.length-1
]
.querySelector(
".materialSelect"
)
.focus();

}
