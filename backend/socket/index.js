const io = require('socket.io')(8080, {
    cors: {
        origin: "http://localhost:5173"
    }
})
let users = []

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    socket.on('addUser', user => {
        addUser(user, socket.id)
    })
    socket.on('disconnect', () => {
        removeUser(socket.id)
    })
    socket.on('messageSent', (userId) => {
        console.log(userId)
        const user = getUser(userId)
        io.to(user.socketId).emit('refreshTheChat')
    })
})
