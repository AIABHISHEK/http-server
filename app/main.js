const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const body = 'Hello, world!';
const response =
    'HTTP/1.1 200 OK\r\n' +
    'Content-Type: text/plain\r\n' +
    `Content-Length: ${body.length}\r\n` +
    'Connection: close\r\n' +
    '\r\n' +
    body;
const server = net.createServer((socket) => {
    // socket.write(response);
    socket.on("data", (data) => {
        console.log("Received data:", data.toString());
        // read url path
        const request = data.toString();
        const [requestLine] = request.split('\r\n'); //we get the first line of http req
        const [method, path, httpVersion] = requestLine.split(' '); //we split the first line by space
        console.log("Method:", method);
        console.log("Path:", path);
        if (path === '/') {
            const body = 'Hello, world!';
            const response =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${body.length}\r\n` +
                'Connection: close\r\n' +
                '\r\n' +
                body;
            socket.write(response);
        } else {
            const body = 'Not Found';
            const response =
                'HTTP/1.1 404 Not Found\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${body.length}\r\n` +
                'Connection: close\r\n' +
                '\r\n' +
                body;
            socket.write(response);
            console.log("No URL path found in the request.");
        }
    });
    socket.on("close", () => {
        socket.end();
    })
})

server.listen(4221, "localhost")
