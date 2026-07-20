// ======================================================
// RVRG STORE MANAGEMENT SYSTEM
// common.js V1.0
// Shared Utility Functions
// ======================================================

// ======================================================
// SUCCESS MESSAGE
// ======================================================

function showSuccess(message) {

    alert("✅ " + message);

}

// ======================================================
// ERROR MESSAGE
// ======================================================

function showError(message) {

    alert("❌ " + message);

    console.error(message);

}

// ======================================================
// CONFIRM ACTION
// ======================================================

function confirmAction(message) {

    return confirm(message);

}

// ======================================================
// FORMAT CURRENCY
// ======================================================

function formatCurrency(value) {

    value = Number(value) || 0;

    return "₹" + value.toFixed(2);

}

// ======================================================
// FORMAT NUMBER
// ======================================================

function formatNumber(value, decimals = 2) {

    return Number(value || 0).toFixed(decimals);

}

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "";

    }

    return new Date(dateValue).toLocaleDateString();

}

// ======================================================
// FORMAT DATE & TIME
// ======================================================

function formatDateTime(dateValue) {

    if (!dateValue) {

        return "";

    }

    return new Date(dateValue).toLocaleString();

}

// ======================================================
// CURRENT DATE
// ======================================================

function getCurrentDate() {

    return new Date().toISOString().split("T")[0];

}

// ======================================================
// CURRENT DATE TIME
// ======================================================

function getCurrentDateTime() {

    return new Date().toISOString();

}

// ======================================================
// VALIDATE REQUIRED FIELD
// ======================================================

function validateRequired(value, fieldName) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        showError(fieldName + " is required.");

        return false;

    }

    return true;

}

// ======================================================
// VALIDATE POSITIVE NUMBER
// ======================================================

function validatePositive(value, fieldName) {

    if (
        isNaN(value) ||
        Number(value) <= 0
    ) {

        showError(fieldName + " must be greater than zero.");

        return false;

    }

    return true;

}

// ======================================================
// CLEAR INPUT
// ======================================================

function clearInput(id) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value = "";

    }

}

// ======================================================
// CLEAR FORM
// ======================================================

function clearForm(formId) {

    const form =
        document.getElementById(formId);

    if (form) {

        form.reset();

    }

}

// ======================================================
// ENABLE BUTTON
// ======================================================

function enableButton(id) {

    const button =
        document.getElementById(id);

    if (button) {

        button.disabled = false;

    }

}

// ======================================================
// DISABLE BUTTON
// ======================================================

function disableButton(id) {

    const button =
        document.getElementById(id);

    if (button) {

        button.disabled = true;

    }

}

// ======================================================
// SHOW LOADER
// ======================================================

function showLoader() {

    console.log("Loading...");

}

// ======================================================
// HIDE LOADER
// ======================================================

function hideLoader() {

    console.log("Completed");

}

// ======================================================
// LOAD DROPDOWN
// ======================================================

async function loadDropdown(
    client,
    table,
    selectId,
    valueField,
    textField,
    orderField = textField
) {

    const { data, error } =
        await client
        .from(table)
        .select("*")
        .order(orderField);

    if (error) {

        showError(error.message);

        return;

    }

    const select =
        document.getElementById(selectId);

    if (!select) {

        return;

    }

    select.innerHTML =
        '<option value="">Select</option>';

    data.forEach(item => {

        select.innerHTML += `
            <option value="${item[valueField]}">
                ${item[textField]}
            </option>
        `;

    });

}

// ======================================================
// LOG ERROR
// ======================================================

function logError(error) {

    console.error(error);

    if (error.message) {

        showError(error.message);

    }

}

// ======================================================
// END OF FILE
// ======================================================
