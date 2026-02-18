const express = require("express")
const db = require("../config/db")

const router = express.Router()

router.get("/", async (req, res) => {

    const [[{ totalDevices }]] = await db.query("SELECT COUNT(*) as totalDevices FROM devices")
    const [[{ totalMessages }]] = await db.query("SELECT COUNT(*) as totalMessages FROM messages")

    res.send(`
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css">
</head>
<body class="hold-transition sidebar-mini">
<div class="wrapper">

<nav class="main-header navbar navbar-white">
  <span class="navbar-brand">WA Webhook Admin</span>
</nav>

<aside class="main-sidebar sidebar-dark-primary">
  <div class="sidebar">
    <ul class="nav nav-pills nav-sidebar flex-column">
      <li class="nav-item"><a href="/dashboard" class="nav-link active">Dashboard</a></li>
      <li class="nav-item"><a href="/dashboard/devices" class="nav-link">Devices</a></li>
      <li class="nav-item"><a href="/dashboard/messages" class="nav-link">Messages</a></li>
    </ul>
  </div>
</aside>

<div class="content-wrapper p-4">
<h3>Dashboard</h3>

<div class="row">
<div class="col-md-4">
<div class="card bg-info">
<div class="card-body">
<h4>Total Devices</h4>
<h2>${totalDevices}</h2>
</div>
</div>
</div>

<div class="col-md-4">
<div class="card bg-success">
<div class="card-body">
<h4>Total Messages</h4>
<h2>${totalMessages}</h2>
</div>
</div>
</div>
</div>

</div>
</div>
</body>
</html>
`)
})

module.exports = router
