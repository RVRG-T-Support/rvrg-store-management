const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

loadDepartments();
loadMaterials();

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

    const materialCode =
        document.getElementById("materialCode").value;

    const materialName =
        document.getElementById("materialName").value;

    const departmentId =
        document.getElementById("departmentId").value;

    const unit =
        document.getElementById("unit").value;

    const minimumStock =
        document.getElementById("minimumStock").value;

    const { error } =
        await supabaseClient
        .from("materials")
        .insert([
            {
                material_code: materialCode,
                material_name: materialName,
                department_id: departmentId,
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
