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
placeholder="0"
onfocus="this.select()"
oninput="calculateRow(${rowIndex})">

</td>

<td>

<input
type="number"
class="price"
placeholder="0"
onfocus="this.select()"
oninput="calculateRow(${rowIndex})">

</td>

<td>

<select
class="gstType"
onchange="calculateRow(${rowIndex})">

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
onfocus="this.select()"
oninput="calculateRow(${rowIndex})"
onkeydown="handleEnter(event, ${rowIndex})">

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

updateSummary();
    
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

updateSummary();

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

    let total;

if (gstType === "INCLUDED") {

    total = qty * price;

}
else {

    total =
        qty *
        (price + (price * gst / 100));

}

    tr.querySelector(".lineTotal").innerText =
        "₹" + total.toFixed(2);
    
    updateSummary();

}

function updateSummary() {

    let items = 0;
    let totalQty = 0;
    let materialValue = 0;

    document
        .querySelectorAll("#stockEntryTable tbody tr")
        .forEach(row => {

            const materialId =
    row.querySelector(".materialSelect").value;

if (!materialId)
    return;

items++;

            const qty =
                Number(
                    row.querySelector(".qty").value
                );

            totalQty += qty;

            const value =
                Number(
                    row.querySelector(".lineTotal")
                    .innerText
                    .replace("₹", "")
                );

            materialValue += value;

        });

    const transport =
        Number(
            document.getElementById(
                "transportCost"
            ).value
        );

    document.getElementById(
        "totalItems"
    ).innerText = items;

    document.getElementById(
        "totalQty"
    ).innerText = totalQty;

    document.getElementById(
        "materialValue"
    ).innerText =
        materialValue.toFixed(2);

    document.getElementById(
        "transportDisplay"
    ).innerText =
        transport.toFixed(2);

    document.getElementById(
        "grandTotal"
    ).innerText =
        (materialValue + transport)
        .toFixed(2);

}

async function handleEnter(event, row) {

    if (event.key !== "Enter") {
        return;
    }

    event.preventDefault();

    await addRow();

    const rows =
        document.querySelectorAll("#stockEntryTable tbody tr");

    rows[rows.length - 1]
        .querySelector(".materialSelect")
        .focus();

}

async function saveStockEntry() {

    const supplierName =
        document.getElementById("supplierName").value.trim();

    const invoiceNo =
        document.getElementById("invoiceNo").value.trim();

    const invoiceDate =
        document.getElementById("invoiceDate").value;

    const transportCost =
        Number(
            document.getElementById("transportCost").value
        ) || 0;

    const remarks =
        document.getElementById("remarks").value.trim();
if (invoiceNo === "") {

    alert("Please enter Invoice Number.");

    return;

}
   const {
    data: existingInvoice
} = await supabaseClient
.from("stock_entry_header")
.select("id")
.eq("invoice_no", invoiceNo);

if (existingInvoice.length > 0) {

    alert(
        "Invoice Number already exists."
    );

    return;

}
    const rows =
        document.querySelectorAll(
            "#stockEntryTable tbody tr"
        );

    if (rows.length === 0) {

        alert("Please add at least one material.");

        return;

    }

    const { data: headerData, error: headerError } =
        await supabaseClient
        .from("stock_entry_header")
        .insert([
            {
                supplier_name: supplierName,
                invoice_no: invoiceNo,
                invoice_date: invoiceDate,
                transport_cost: transportCost,
                remarks: remarks,
                created_by: "Store Keeper"
            }
        ])
        .select()
        .single();

    if (headerError) {

        alert(headerError.message);

        return;

    }

    const stockEntryId =
        headerData.id;

    for (const row of rows) {

        const material =
            row.querySelector(".materialSelect");

        const materialId =
            Number(material.value);

        if (!materialId)
            continue;

        const qty =
            Number(
                row.querySelector(".qty").value
            );

        const price =
            Number(
                row.querySelector(".price").value
            );

        const gstType =
            row.querySelector(".gstType").value;

        const gst =
            Number(
                row.querySelector(".gst").value
            );

        const lineTotal =
            Number(
                row.querySelector(".lineTotal")
                .innerText
                .replace("₹", "")
            );

        const { error: detailError } =
            await supabaseClient
            .from("stock_entry_details")
            .insert([
                {
                    stock_entry_id: stockEntryId,

                    material_id: materialId,

                    quantity: qty,

                    purchase_price: price,

                    gst_type: gstType,

                    gst_percentage: gst,

                    line_total: lineTotal
                }
            ]);

        if (detailError) {

            alert(detailError.message);

            return;

        }
    await supabaseClient
.from("stock_ledger")
.insert([
    {

        material_id: materialId,

        transaction_type: "STOCK_IN",

        quantity: qty,

        transaction_date: invoiceDate,

        reference_no: invoiceNo,

        remarks:
            "Stock Entry",

        created_by:
            "Store Keeper"

    }
]);

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

"✅ Stock Entry Saved Successfully\n\n" +

"Invoice : " + invoiceNo +

"\nItems : " + items +

"\nTotal Qty : " + totalQty +

"\nGrand Total : ₹" +

document.getElementById(
"grandTotal"
).innerText

);

document.getElementById(
"supplierName"
).value = "";

document.getElementById(
"invoiceNo"
).value = "";

document.getElementById(
"transportCost"
).value = "";

document.getElementById(
"invoiceAmount"
).value = "";

document.getElementById(
"remarks"
).value = "";

document.querySelector(
"#stockEntryTable tbody"
).innerHTML = "";

rowIndex = 0;

updateSummary();

await addRow();

document.getElementById(
"supplierName"
).focus();

}
