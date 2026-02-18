const express = require("express")
const axios = require("axios")
const db = require("../config/db")

const router = express.Router()

/* SESSION UPDATE */
router.post("/session", async (req, res) => {

    const { session, status } = req.body

    await db.query(
        "INSERT INTO session_logs (session, status) VALUES (?, ?)",
        [session, status]
    )

    await db.query(
        "INSERT IGNORE INTO devices (session) VALUES (?)",
        [session]
    )

    res.json({ ok: true })
})

/* MESSAGE */
router.post("/message", async (req, res) => {

    const { session, from, message } = req.body

    await db.query(
        "INSERT INTO messages (session, sender, message) VALUES (?, ?, ?)",
        [session, from, message]
    )

    const [rows] = await db.query(
        "SELECT webhook_url FROM devices WHERE session = ?",
        [session]
    )

    if (rows.length && rows[0].webhook_url) {
        try {
            await axios.post(rows[0].webhook_url, req.body)
        } catch (err) {
            console.log("Webhook forward error:", err.message)
        }
    }

    res.json({ ok: true })
})

module.exports = router
