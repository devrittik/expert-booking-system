function registerSlotHandlers(_io, socket) {
    socket.on("expert:watch", (expertId) => {
        if (expertId) {
            socket.join(`expert:${expertId}`);
        }
    });

    socket.on("expert:leave", (expertId) => {
        if (expertId) {
            socket.leave(`expert:${expertId}`);
        }
    });
}

module.exports = { registerSlotHandlers };
