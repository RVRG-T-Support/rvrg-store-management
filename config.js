const SUPABASE_URL = "https://immkxmskfeoksebnlidv.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_mVD5kA-c8Lzo2Md9yl4g7w_6V7TXaJO";

// ===== USER ROLE =====

// ===== DEVELOPMENT ROLE SWITCHER =====

const CURRENT_USER = {

    name: "Development User",

    role: localStorage.getItem("RVRG_ROLE") || "ADMIN"

};

// Roles:
// STORE
// AFM
// FM
// ADMIN
// ======================================================
// SUPABASE CLIENT
// ======================================================

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
