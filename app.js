const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

async function loadMaterials() {

    const { data, error } = await supabaseClient
        .from("materials")
        .select("*");

    if (error) {
        console.error(error);
        alert("Error loading materials");
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
            <td>${material.unit}</td>
        </tr>
        `;

    });

}
