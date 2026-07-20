// =====================================
// RVRG STORE MANAGEMENT
// ISSUE MODULE V2
// M-01 : INITIAL SETUP
// =====================================

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

// =====================================
// IS-01 : PAGE LOAD
// =====================================

window.onload = async function(){

    await loadApprovedRequests();

};

// =====================================
// IS-02 : LOAD APPROVED REQUESTS
// =====================================

async function loadApprovedRequests(){

    console.log("IS-02 Started");

}

