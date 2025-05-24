const net = require("net");
const { URL } = require("url");
const { parseHttpRequest } = require("./util/parse_request.js");
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
        const {
            method,
            path,
            httpVersion,
            headers,
            body
        } = parseHttpRequest(request);
        console.log("Parsed request:", {
            method,
            path,
            httpVersion,
            headers,
            body
        });
        console.log("Request header user-agent:", headers["user-agent"]);
        const [requestLine] = request.split('\r\n'); 
        // const [method, path, httpVersion] = requestLine.split(' ');
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
        }
        else if (path === '/user-agent') {
            const body = headers["user-agent"];
            const response =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${body.length}\r\n` +
                'Connection: close\r\n' +
                '\r\n' +
                body;
            socket.write(response);
        }
        else if (path === '/echo') {
            const body = 'Abc echo res!';
            const response =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${body.length}\r\n` +
                'Connection: close\r\n' +
                '\r\n' +
                body;
            socket.write(response);
        }
        else if (path.startsWith('/echo/')) {
            const body = 'Abc echo res!';
            const response =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${body.length}\r\n` +
                'Connection: close\r\n' +
                '\r\n' +
                body;
            socket.write(response);
        }
        else {
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
