const express = require("express")
const morgan = require("morgan")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")

// Routes
const waRoutes = require("./routes/waRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express()

/* =========================
   BASIC MIDDLEWARE
========================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")))

/* =========================
   VIEW ENGINE
========================= */
app.use(expressLayouts)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.set("layout", "layouts/main")  // default layout

/* =========================
   ROUTES
========================= */
app.use("/webhook/wa", waRoutes)
app.use("/dashboard", dashboardRoutes)

/* =========================
   ROOT REDIRECT
========================= */
app.get("/", (req, res) => {
  res.redirect("/dashboard")
})

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).send("404 Not Found")
})

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Internal Server Error")
})

module.exports = app
