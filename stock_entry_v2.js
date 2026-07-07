const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let rowCount = 0;

window.onload = function () {

    document.getElementById("invoiceDate").value =
        new Date().toISOString().split("T")[0];

    /*document
        .getElementById("transportCost")
        .addEventListener(
            "input",
            updateSummary
        );
*/
    addRow();

};

async function addRow() {

    rowCount++;

    const tbody =
        document.querySelector(
            "#stockEntryTable tbody"
        );

    const { data } =
        await supabaseClient
        .from("materials")
        .select("id, material_code, material_name")
        .eq("is_active", true)
        .order("material_code");

    let options =
        '<option value="">Select</option>';

    data.forEach(item => {

        options += `

        <option value="${item.id}">

            ${item.material_code} - ${item.material_name}

        </option>`;

    });

    tbody.insertAdjacentHTML("beforeend", `

<tr id="row${rowCount}">

<td>

<select class="material">

${options}

</select>

</td>

<td>

<input
type="number"
class="qty"
value="0"
oninput="calculateRow(${rowCount})">

</td>

<td>

<input
type="number"
class="price"
value="0"
oninput="calculateRow(${rowCount})">

</td>

<td>

<select class="gstType"
onchange="calculateRow(${rowCount})">

<option value="INCLUDED">

Included

</option>

<option value="EXCLUDED">

Excluded

</option>

</select>

</td>

<td>

<input
type="number"
class="gst"
value="18"
oninput="calculateRow(${rowCount})">

</td>

<td class="lineTotal">

₹0.00

</td>

<td>

<button
onclick="deleteRow(${rowCount})">

❌

</button>

</td>

</tr>

`);

updateSummary();

}
