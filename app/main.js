const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    socket.write("Welcome to the server!\n");
    socket.on("close", () => {
        socket.end();
    })
})

server.listen(4221, "localhost")
