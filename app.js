const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadDepartments();
loadMaterials();
loadStockMaterials();

async function loadDepartments() {

    const { data, error } =
        await supabaseClient
        .from("departments")
        .select("*")
        .order("department_name");

    if (error) {
        console.error(error);
        return;
    }

    const select =
        document.getElementById("departmentId");

    select.innerHTML =
        '<option value="">Select Department</option>';

    data.forEach(dep => {

        select.innerHTML += `
            <option value="${dep.id}">
                ${dep.department_name}
            </option>
        `;

    });

}

async function addMaterial() {

    const departmentId =
        document.getElementById("departmentId").value;

    const category =
        document.getElementById("category").value;

    const materialName =
        document.getElementById("materialName").value;

    const brand =
        document.getElementById("brand").value;

    const itemType =
        document.getElementById("itemType").value;

    const itemSize =
        document.getElementById("itemSize").value;

    const rating =
        document.getElementById("rating").value;

    const specification =
        document.getElementById("specification").value;

    const rackLocation =
        document.getElementById("rackLocation").value;

    const description =
        document.getElementById("description").value;

    const unit =
        document.getElementById("unit").value;

    const minimumStock =
        document.getElementById("minimumStock").value;

    if (!departmentId ||
        !materialName ||
        !unit ||
        !minimumStock) {

        alert(
            "Department, Material Name, Unit and Minimum Stock are required."
        );

        return;
    }

    const { data: deptData } =
    await supabaseClient
    .from("departments")
    .select("prefix")
    .eq("id", departmentId)
    .single();

const prefix = deptData.prefix;

const { data: existingMaterials } =
    await supabaseClient
    .from("materials")
    .select("material_code")
    .like("material_code", prefix + "-%");

let nextNumber = 1;

if (existingMaterials.length > 0) {

    const numbers =
        existingMaterials.map(item => {

            const parts =
                item.material_code.split("-");

            return parseInt(parts[1]) || 0;

        });

    nextNumber =
        Math.max(...numbers) + 1;
}

const materialCode =
    prefix + "-" +
    String(nextNumber).padStart(3, "0");

    const { error } =
        await supabaseClient
        .from("materials")
        .insert([
            {
                material_code: materialCode,
                material_name: materialName,
                department_id: departmentId,

                category: category,
                brand: brand,
                item_type: itemType,
                item_size: itemSize,
                rating: rating,
                specification: specification,
                rack_location: rackLocation,
                description: description,

                unit: unit,
                minimum_stock: minimumStock
            }
        ]);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Material Saved");

    loadMaterials();
}
async function loadMaterials() {

    const { data, error } =
        await supabaseClient
        .from("materials")
        .select(`
            *,
            departments (
                department_name
            )
        `)
        .order("material_code");

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.querySelector("#materialsTable tbody");

    tbody.innerHTML = "";

    data.forEach(material => {

        tbody.innerHTML += `
        <tr>
            <td>${material.material_code}</td>
            <td>${material.material_name}</td>
            <td>${material.departments.department_name}</td>
            <td>${material.unit}</td>
            <td>${material.minimum_stock}</td>
        </tr>
        `;

    });

}
async function loadStockMaterials() {

    const { data, error } =
        await supabaseClient
        .from("materials")
        .select("id, material_code, material_name")
        .order("material_code");

    if (error) {
        console.error(error);
        return;
    }

    const select =
        document.getElementById("stockMaterial");

    select.innerHTML =
        '<option value="">Select Material</option>';

    data.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.material_code}
                - ${item.material_name}
            </option>
        `;

    });

}
async function addStock() {

    const materialId =
        document.getElementById("stockMaterial").value;

    const qty =
        document.getElementById("stockQty").value;

    const referenceNo =
        document.getElementById("referenceNo").value;

    const remarks =
        document.getElementById("stockRemarks").value;

    if (!materialId || !qty) {

        alert(
            "Material and Quantity are required."
        );

        return;
    }

    const { error } =
        await supabaseClient
        .from("stock_ledger")
        .insert([
            {
                material_id: materialId,
                transaction_type: "STOCK_IN",
                quantity: qty,
                reference_no: referenceNo,
                remarks: remarks,
                created_by: 1
            }
        ]);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Stock Added Successfully");

    document.getElementById("stockQty").value = "";
    document.getElementById("referenceNo").value = "";
    document.getElementById("stockRemarks").value = "";

}
