const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadDepartments();

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
