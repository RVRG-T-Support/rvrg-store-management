const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadDepartments();
loadMaterials();
loadStockMaterials();
loadLowStock();
loadTechnicians();
loadRequestMaterials();
loadNotifications();

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

    const unitCost =
        document.getElementById("unitCost").value || 0;

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
                unit_cost: unitCost,
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
        .from("current_stock")
        .select("*")
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
            <td>${material.department_name}</td>
            <td>${material.current_stock}</td>
            <td>${material.unit}</td>
            <td>${material.unit_cost || 0}</td>
            <td>${material.minimum_stock}</td>
        </tr>
        `;

    });

}async function loadStockMaterials() {

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
async function loadLowStock() {

    const { data, error } =
        await supabaseClient
        .from("low_stock_alerts")
        .select("*")
        .order("material_code");

    if (error) {
        console.error(error);
        return;
    }

    const tbody =
        document.querySelector("#lowStockTable tbody");

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `
        <tr>
            <td>${item.material_code}</td>
            <td>${item.material_name}</td>
            <td>${item.current_stock}</td>
            <td>${item.minimum_stock}</td>
        </tr>
        `;

    });

}

async function loadTechnicians() {

    const { data, error } =
        await supabaseClient
        .from("technicians")
        .select("*")
        .order("technician_name");

    if (error) {
        console.error(error);
        return;
    }

    const select =
        document.getElementById("technicianId");

    select.innerHTML =
        '<option value="">Select Technician</option>';

    data.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.technician_name}
            </option>
        `;

    });

}

async function loadRequestMaterials() {

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
        document.getElementById("requestMaterial");

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

async function submitRequest() {

    const ticketNo =
        document.getElementById("ticketNo").value;

    const locationType =
        document.getElementById("locationType").value;

    const locationName =
        document.getElementById("locationName").value;

    const technicianId =
        document.getElementById("technicianId").value;

    const materialId =
        document.getElementById("requestMaterial").value;

    const requestedQty =
        document.getElementById("requestedQty").value;

    const remarks =
        document.getElementById("requestRemarks").value;

    if (!ticketNo ||
        !locationType ||
        !locationName ||
        !technicianId ||
        !materialId ||
        !requestedQty) {

        alert("Please fill all required fields.");
        return;
    }

    const { error } =
        await supabaseClient
        .from("material_requests")
        .insert([
            {
                ticket_no: ticketNo,
                location_type: locationType,
                location_name: locationName,
                technician_id: technicianId,
                material_id: materialId,
                requested_qty: requestedQty,
                remarks: remarks,
                request_status: "PENDING",
                requested_by: 1
            }
        ]);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Request Submitted");

}

async function loadNotifications() {

    // Pending Material Requests

    let { count: requestCount } = await supabaseClient
        .from("material_requests")
        .select("*", { count: "exact", head: true })
        .eq("request_status", "PENDING");

    document.getElementById("pendingRequestCount").innerText =
        requestCount ?? 0;

    // Pending Inventory Corrections

    let { count: correctionCount } = await supabaseClient
        .from("inventory_correction_requests")
        .select("*", { count: "exact", head: true })
        .eq("request_status", "PENDING");

    document.getElementById("pendingCorrectionCount").innerText =
        correctionCount ?? 0;

    // Low Stock

    let { count: lowStockCount } = await supabaseClient
        .from("low_stock_alerts")
        .select("*", { count: "exact", head: true });

    document.getElementById("lowStockCountNotification").innerText =
        lowStockCount ?? 0;

}
