const express = require("express")
const router = express.Router()
const db = require("../config/db")

router.get("/", async (req, res) => {

  const [[{ totalDevices }]] = await db.query(
    "SELECT COUNT(*) as totalDevices FROM devices"
  )

  const [[{ totalMessages }]] = await db.query(
    "SELECT COUNT(*) as totalMessages FROM messages"
  )

  res.render("dashboard", {
    totalDevices,
    totalMessages
  })
})

module.exports = router
