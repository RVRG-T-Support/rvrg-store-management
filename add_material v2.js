const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadDepartments();
        document
            .getElementById(
                "department"
            )
            .focus();

        document
            .getElementById("department")
            .addEventListener(
                "change",
                generateMaterialCode
            );

        document
            .getElementById("gstType")
            .addEventListener(
                "change",
                gstTypeChanged
            );

    }
);

// Load Departments 02B

async function loadDepartments() {

    const { data, error } =
        await supabaseClient
            .from("departments")
            .select("*")
            .order("department_name");

    if (error) {

        alert(error.message);

        return;

    }

    const department =
        document.getElementById(
            "department"
        );

    department.innerHTML =
        '<option value="">Select Department</option>';

    data.forEach(dep => {

        department.innerHTML +=

        `<option value="${dep.id}">

            ${dep.department_name}

        </option>`;

    });

}

// MAT-02C GST Auto Change

function gstTypeChanged() {

    const gstType =
        document.getElementById(
            "gstType"
        ).value;

    const gst =
        document.getElementById(
            "gstPercentage"
        );

    if (gstType === "No GST") {

        gst.value = 0;

        gst.readOnly = true;

    }

    else {

        if (gst.value == 0)

            gst.value = 18;

        gst.readOnly = false;

    }

}

// MAT-03 Auto Material Code

async function generateMaterialCode() {

    const departmentId =
        document.getElementById(
            "department"
        ).value;

    if (departmentId === "")
        return;

    const { data: dep } =
        await supabaseClient
            .from("departments")
            .select("*")
            .eq("id", departmentId)
            .single();

    const prefix =
        dep.department_prefix;

    const { data: materials } =
        await supabaseClient
            .from("materials")
            .select("material_code")
            .like(
                "material_code",
                prefix + "-%"
            );

    let nextNumber = 1;

    if (materials.length > 0) {

        nextNumber =
            Math.max(

                ...materials.map(m =>

                    Number(

                        m.material_code
                            .split("-")[1]

                    )

                )

            ) + 1;

    }

    document.getElementById(
        "materialCode"
    ).value =

        prefix +

        "-" +

        String(nextNumber)
            .padStart(3, "0");

}

// =====================================
// MAT-04 : VALIDATION
// =====================================

function validateMaterial() {

    if (
        document.getElementById("department").value == ""
    ) {

        alert("Select Department.");

        document.getElementById("department").focus();

        return false;

    }

    if (
        document.getElementById("materialName")
        .value.trim() == ""
    ) {

        alert("Enter Material Name.");

        document.getElementById("materialName").focus();

        return false;

    }

    if (
        document.getElementById("unit").value == ""
    ) {

        alert("Select Unit.");

        document.getElementById("unit").focus();

        return false;

    }

    const price =
        Number(
            document.getElementById("unitCost").value
        );

    if (price <= 0) {

        alert("Default Purchase Price must be greater than 0.");

        document.getElementById("unitCost").focus();

        return false;

    }

    const minStock =
        Number(
            document.getElementById("minimumStock").value
        );

    if (minStock < 0) {

        alert("Minimum Stock cannot be negative.");

        document.getElementById("minimumStock").focus();

        return false;

    }

    return true;

}

// =====================================
// MAT-05 : SAVE MATERIAL
// =====================================

async function saveMaterial() {

    if (!validateMaterial())
        return;

    const departmentId =
        document.getElementById("department").value;

    const materialCode =
        document.getElementById("materialCode").value;

    const materialName =
        document.getElementById("materialName").value.trim();

    const brand =
        document.getElementById("brand").value.trim();

    const itemType =
        document.getElementById("itemType").value.trim();

    const itemSize =
        document.getElementById("itemSize").value.trim();

    const unit =
        document.getElementById("unit").value;

    const unitCost =
        Number(
            document.getElementById("unitCost").value
        );

    const gstType =
        document.getElementById("gstType").value;

    const gstPercentage =
        Number(
            document.getElementById("gstPercentage").value
        );

    const minimumStock =
        Number(
            document.getElementById("minimumStock").value
        );

    const specification =
        document.getElementById("specification").value.trim();
    
    // Duplicate Check===============================
    
        const {
        data: existingMaterial
    } =
    await supabaseClient
    .from("materials")
    .select("id")
    .eq("department_id", departmentId)
    .eq("material_name", materialName)
    .eq("item_type", itemType)
    .eq("item_size", itemSize);

    if (existingMaterial.length > 0) {

        alert("Material already exists.");

        return;

    }

    // Insert=============================
    
        const {
        error
    } =
    await supabaseClient
    .from("materials")
    .insert([
        {

            department_id: departmentId,

            material_code: materialCode,

            material_name: materialName,

            brand: brand,

            item_type: itemType,

            item_size: itemSize,

            unit: unit,

            unit_cost: unitCost,

            gst_type: gstType,

            gst_percentage: gstPercentage,

            minimum_stock: minimumStock,

            specification: specification,

            is_active: "ACTIVE"

        }
    ]);

    if (error) {

        alert(error.message);

        return;

    }

    alert(

"✅ Material Saved Successfully\n\n" +

"Material Code : " +

materialCode +

"\nDepartment : " +

document.getElementById("department")
.options[
document.getElementById("department")
.selectedIndex
].text +

"\nMaterial : " +

materialName

);
    resetForm();

}

// =====================================
// MAT-06 : RESET FORM
// =====================================

async function resetForm() {

    document.getElementById("materialName").value = "";

    document.getElementById("brand").value = "";

    document.getElementById("itemType").value = "";

    document.getElementById("itemSize").value = "";

    document.getElementById("unit").value = "";

    document.getElementById("unitCost").value = "";

    document.getElementById("gstType").value = "Included";

    document.getElementById("gstPercentage").value = 18;

    document.getElementById("minimumStock").value = "";

    document.getElementById("specification").value = "";

    await generateMaterialCode();

    document.getElementById("materialName").focus();

}

// =====================================
// MAT-07 : ENTER KEY NAVIGATION
// =====================================

document.addEventListener(
"keydown",

function(e){

if(e.key !== "Enter")
return;

const tag =
document.activeElement.tagName;

if(
tag !== "INPUT" &&
tag !== "SELECT"
)
return;

e.preventDefault();

const fields =
Array.from(
document.querySelectorAll(
"input, select"
)
);

const index =
fields.indexOf(
document.activeElement
);

if(
index >= 0 &&
index < fields.length-1
){

fields[index+1].focus();

}

}
);
/*

Reference Map

MAT-02A  Initialization

MAT-02B  Load Departments

MAT-02C  GST Change

MAT-03   Auto Material Code

MAT-04   Validation

MAT-05   Save Material

MAT-06   Reset Form

*/
