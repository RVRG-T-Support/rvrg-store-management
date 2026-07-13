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

MR-03 Generate Request Number

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

await generateRequestNo();

}

// =====================================
// MR-02C : LOAD TECHNICIANS
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

`<option value="${item.id}">

${item.technician_name}

</option>`;

});

}

// =====================================
// MR-03 : REQUEST NUMBER
// =====================================

async function generateRequestNo(){

const {data,error} =
await supabaseClient
.from("material_requests")
.select("request_no")
.like(
"request_no",
"MR-%"
);

let next=1;

if(data.length>0){

next =
Math.max(

...data.map(x=>

Number(

x.request_no
.split("-")[1]

)

)

)+1;

}

document.getElementById(
"requestNo"
).value=

"MR-"+

String(next)
.padStart(6,"0");

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
.eq("is_active","ACTIVE")
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

oninput="updateSummary()">

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
