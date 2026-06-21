async function issueMaterial(
requestId,
materialId
) {

```
const issueQty =
    document.getElementById(
        `issue_${requestId}`
    ).value;

const { data: requestData, error: requestLookupError } =
    await supabaseClient
    .from("material_requests")
    .select("ticket_no")
    .eq("id", requestId)
    .single();

if (requestLookupError) {

    alert(requestLookupError.message);
    return;

}

const { error: ledgerError } =
    await supabaseClient
    .from("stock_ledger")
    .insert([
        {
            material_id: materialId,
            transaction_type: "ISSUE",
            quantity: issueQty,
            request_id: requestId,
            reference_no: requestData.ticket_no,
            remarks: "Material Issued",
            created_by: 1
        }
    ]);

if (ledgerError) {

    alert(ledgerError.message);
    return;

}

const { error: requestError } =
    await supabaseClient
    .from("material_requests")
    .update({
        request_status: "ISSUED",
        issued_qty: issueQty
    })
    .eq("id", requestId);

if (requestError) {

    alert(requestError.message);
    return;

}

alert("Material Issued");

loadApprovedRequests();
```

}
