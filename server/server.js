const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");
const { registerSlotHandlers } = require("./src/socket/slotHandler");

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST", "PATCH"],
    },
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    registerSlotHandlers(io, socket);

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
