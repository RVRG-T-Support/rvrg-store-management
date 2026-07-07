const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let rowIndex = 0;

window.onload = function () {

    document.getElementById("invoiceDate").value =
        new Date().toISOString().split("T")[0];

    addRow();

};

async function loadMaterialOptions() {

    const { data, error } =
        await supabaseClient
        .from("materials")
        .select(`
            id,
            material_code,
            material_name,
            unit_cost,
            gst_type,
            gst_percentage
        `)
        .eq("is_active", true)
        .order("material_code");

    if (error) {

        console.error(error);

        return "";

    }

    let options =
        '<option value="">Select Material</option>';

    data.forEach(item => {

        options += `
        <option
            value="${item.id}"
            data-price="${item.unit_cost}"
            data-gsttype="${item.gst_type}"
            data-gst="${item.gst_percentage}">

            ${item.material_code} - ${item.material_name}

        </option>
        `;

    });

    return options;

}

async function addRow() {

    rowIndex++;

    const tbody =
        document.querySelector(
            "#stockEntryTable tbody"
        );

    const materialOptions =
        await loadMaterialOptions();

    const html = `

<tr id="row${rowIndex}">

<td>

<select
class="materialSelect"
onchange="materialChanged(${rowIndex})">

${materialOptions}

</select>

</td>

<td>

<input
type="number"
class="qty"
value="0"
oninput="calculateRow(${rowIndex})">

</td>

<td>

<input
type="number"
class="price"
value="0"
oninput="calculateRow(${rowIndex})">

</td>

<td>

<select class="gstType">

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
value="18">

</td>

<td class="lineTotal">

₹0.00

</td>

<td>

<button
type="button"
onclick="deleteRow(${rowIndex})">

❌

</button>

</td>

</tr>

`;

    tbody.insertAdjacentHTML(
        "beforeend",
        html
    );

}

function materialChanged(row) {

    const tr =
        document.getElementById("row" + row);

    const material =
        tr.querySelector(".materialSelect");

    const option =
        material.options[material.selectedIndex];

    tr.querySelector(".price").value =
        option.dataset.price || 0;

    tr.querySelector(".gstType").value =
        option.dataset.gsttype || "INCLUDED";

    tr.querySelector(".gst").value =
        option.dataset.gst || 18;

    calculateRow(row);

}

function deleteRow(row) {

    document
        .getElementById("row" + row)
        .remove();

}

function calculateRow(row) {

    const tr =
        document.getElementById("row" + row);

    const qty =
        Number(tr.querySelector(".qty").value);

    const price =
        Number(tr.querySelector(".price").value);

    const gst =
        Number(tr.querySelector(".gst").value);

    const gstType =
        tr.querySelector(".gstType").value;

    let total = qty * price;

    if (gstType === "EXCLUDED") {

        total += total * gst / 100;

    }

    tr.querySelector(".lineTotal").innerText =
        "₹" + total.toFixed(2);

}
