<!DOCTYPE html>
<html>
<head>
    <title>RVRG - Material Return</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h1>Material Return</h1>

<a href="index.html">Dashboard</a>

<hr>

<h2>Issued Requests</h2>

<table border="1" id="returnTable">

    <thead>
        <tr>
            <th>Ticket</th>
            <th>Location</th>
            <th>Material</th>
            <th>Issued Qty</th>
            <th>Return Qty</th>
            <th>Action</th>
        </tr>
    </thead>

    <tbody></tbody>

</table>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>
<script src="return.js"></script>

</body>
</html>
