require("dotenv").config()
const express = require("express")
const morgan = require("morgan")

const waRoutes = require("./routes/wa")
const dashboardRoutes = require("./routes/dashboard")

const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use("/webhook/wa", waRoutes)
app.use("/dashboard", dashboardRoutes)

app.listen(process.env.PORT, () => {
    console.log(`🚀 Running on port ${process.env.PORT}`)
})
