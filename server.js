require("dotenv").config()

const http = require("http")
const { Server } = require("socket.io")
const app = require("./src/app")

const server = http.createServer(app)
const io = new Server(server)

app.set("io", io)

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)
})

server.listen(process.env.PORT, () => {
  console.log(`🚀 Running on port ${process.env.PORT}`)
})
