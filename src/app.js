const express = require("express")
const morgan = require("morgan")
const path = require("path")

const waRoutes = require("./routes/waRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.use("/webhook/wa", waRoutes)
app.use("/dashboard", dashboardRoutes)

module.exports = app
