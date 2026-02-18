const express = require("express")
const axios = require("axios")
const db = require("../config/db")

const router = express.Router()

/* =========================
   SESSION UPDATE
========================= */
router.post("/session", async (req, res) => {
  try {
    const { session, status } = req.body

    if (!session) {
      return res.status(400).json({ error: "Session required" })
    }

    await db.query(
      "INSERT INTO session_logs (session, status) VALUES (?, ?)",
      [session, status]
    )

    await db.query(
      "INSERT IGNORE INTO devices (session) VALUES (?)",
      [session]
    )

    res.json({ ok: true })
  } catch (err) {
    console.error("Session error:", err)
    res.status(500).json({ error: "Internal error" })
  }
})

/* =========================
   MESSAGE
========================= */
router.post("/message", async (req, res) => {
  try {
    const { session, from, message } = req.body

    if (!session) {
      return res.status(400).json({ error: "Session required" })
    }

    // 1️⃣ Save message
    await db.query(
      "INSERT INTO messages (session, sender, message) VALUES (?, ?, ?)",
      [session, from, message]
    )

    // 2️⃣ Realtime emit
    const io = req.app.get("io")
    io.emit("new_message", {
      session,
      from,
      message
    })

    // 3️⃣ Forward to device webhook (if exists)
    const [rows] = await db.query(
      "SELECT webhook_url FROM devices WHERE session = ?",
      [session]
    )

    if (rows.length && rows[0].webhook_url) {
      try {
        await axios.post(rows[0].webhook_url, {
          session,
          from,
          message
        }, {
          timeout: 5000
        })
      } catch (err) {
        console.error("Webhook failed:", err.message)
      }
    }

    res.json({ ok: true })
  } catch (err) {
    console.error("Message error:", err)
    res.status(500).json({ error: "Internal error" })
  }
})

module.exports = router
