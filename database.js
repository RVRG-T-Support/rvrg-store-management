// ======================================================
// RVRG STORE MANAGEMENT SYSTEM
// File      : database.js
// Version   : V1.0
// Purpose   : Shared Database Functions
// ======================================================

// ------------------------------------------------------
// GET ALL RECORDS
// ------------------------------------------------------

async function dbGetAll(table, orderBy = "id") {

    const { data, error } =
        await supabaseClient
            .from(table)
            .select("*")
            .order(orderBy);

    if (error) {

        showError(error.message);

        return [];

    }

    return data;

}

// ------------------------------------------------------
// GET BY ID
// ------------------------------------------------------

async function dbGetById(table, id) {

    const { data, error } =
        await supabaseClient
            .from(table)
            .select("*")
            .eq("id", id)
            .single();

    if (error) {

        showError(error.message);

        return null;

    }

    return data;

}

// ------------------------------------------------------
// INSERT
// ------------------------------------------------------

async function dbInsert(table, record) {

    const { data, error } =
        await supabaseClient
            .from(table)
            .insert([record])
            .select()
            .single();

    if (error) {

        showError(error.message);

        return null;

    }

    return data;

}

// ------------------------------------------------------
// UPDATE
// ------------------------------------------------------

async function dbUpdate(table, id, record) {

    const { error } =
        await supabaseClient
            .from(table)
            .update(record)
            .eq("id", id);

    if (error) {

        showError(error.message);

        return false;

    }

    return true;

}

// ------------------------------------------------------
// DELETE
// ------------------------------------------------------

async function dbDelete(table, id) {

    const { error } =
        await supabaseClient
            .from(table)
            .delete()
            .eq("id", id);

    if (error) {

        showError(error.message);

        return false;

    }

    return true;

}

// ------------------------------------------------------
// COUNT
// ------------------------------------------------------

async function dbCount(table) {

    const { count, error } =
        await supabaseClient
            .from(table)
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {

        showError(error.message);

        return 0;

    }

    return count;

}

// ======================================================
// END OF FILE
// ======================================================
