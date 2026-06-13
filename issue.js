
<!DOCTYPE html>
<html>
<head>
    <title>RVRG - Issue Material</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h1>Issue Material</h1>

<a href="index.html">Dashboard</a>

<hr>

<h2>Approved Requests</h2>

<table border="1" id="issueTable">

    <thead>
        <tr>
            <th>Ticket</th>
            <th>Location</th>
            <th>Material</th>
            <th>Requested</th>
            <th>Issue Qty</th>
            <th>Action</th>
        </tr>
    </thead>

    <tbody></tbody>

</table>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>
<script src="issue.js"></script>

</body>
</html>
