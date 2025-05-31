const net = require("net");
const fs = require("fs");
const { parseHttpRequest, buildResponse, endOfRequest } = require("./util/parse_request.js");
const PATH = require('path');

console.log("Logs from your program will appear here!");
const body = 'Hello, world!';
const response =
    'HTTP/1.1 200 OK\r\n' +
    'Content-Type: text/plain\r\n' +
    `Content-Length: ${body.length}\r\n` +
    // 'Connection: close\r\n' +
    '\r\n' +
    body;
    const server = net.createServer((socket) => {
        console.log("New connection established");
        // socket.write(response);
        let buffer = Buffer.alloc(0);
        socket.on("data", (data) => {
            buffer = Buffer.concat([buffer, data]);
            console.log("Received data:", data.toString());
            // read url path
            // if req complete we will proceed
            let endOfReq;
            while ((endOfReq = endOfRequest(buffer)) !== -1) {
                // const request = data.toString();
                const request = buffer.subarray(0, endOfReq).toString(); // +4 for \r\n\r\n
                // remove the processed part from the buffer
                buffer = buffer.subarray(endOfReq); // 4 for \r\n\r\n
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
                console.log("Method:", method);
                console.log("Path:", path);
                if (path === '/') {
                    const body = 'Hello, world!';
                    const response = buildResponse({ statusCode: 200, headers: {}, body }, headers);
                    socket.write(response);
                }
                else if (path === '/files') {
                    console.log("Request for /files");
                    // const filePath = path.replace('/files/', '');
                    const fullPath = "data.txt";
                    const filePath = PATH.join(__dirname, fullPath);
                    console.log("File path:", filePath);
                    fs.stat(filePath, (err, stats) => {
                        console.log("File path:", fullPath);
                        console.log("File stats:", stats);
                        console.log("Error:", err);
                        if (err || !stats.isFile()) {
                            const body = 'File Not Found';
                            const response =
                                'HTTP/1.1 404 Not Found\r\n' +
                                'Content-Type: text/plain\r\n' +
                                `Content-Length: ${body.length}\r\n` +
                                'Connection: close\r\n' +
                                '\r\n' +
                                body;
                            socket.write(response);
                            socket.end();
                        } else {
                            fs.readFile(filePath, (err, data) => {
                                if (err) {
                                    console.error("Error reading file:", err);
                                    const body = 'Internal Server Error';
                                    const response =
                                        'HTTP/1.1 500 Internal Server Error\r\n' +
                                        'Content-Type: text/plain\r\n' +
                                        `Content-Length: ${body.length}\r\n` +
                                        'Connection: close\r\n' +
                                        '\r\n' +
                                        body;
                                    socket.write(response);
                                    socket.end();
                                    return;
                                }
                                // console.log("File data:", data.toString());
                                console.log("File data:", data);
                                const response =
                                    'HTTP/1.1 200 OK\r\n' +
                                    'Content-Type: application/octet-stream\r\n' +
                                    `Content-Length: ${stats.size}\r\n` +
                                    'Connection: keep-alive\r\n' +
                                    '\r\n' +
                                    data;
                                socket.write(response);
                            });
                        }
                    });
                }
                else if (path.startsWith('/files/') && path.length > 7) {
                    console.log("Request for /files/");
                    // create a file with the given name after
                    const fileName = path.slice(7); // Extract the file name from the path
                    const fullPath = PATH.join(__dirname, fileName);
                    console.log("File path:", fullPath);
                    fs.writeFile(fullPath, body, (err) => {
                        if (err) {
                            console.error("Error writing file:", err);
                            const response =
                                'HTTP/1.1 500 Internal Server Error\r\n' +
                                'Content-Type: text/plain\r\n' +
                                'Connection: close\r\n' +
                                '\r\n' +
                                'Internal Server Error';
                            socket.write(response);
                        } else {
                            const response =
                                'HTTP/1.1 201 Created\r\n' +
                                'Content-Type: text/plain\r\n' +
                                `Content-Length: ${body.length}\r\n` +
                                'Connection: close\r\n' +
                                '\r\n' +
                                body;
                            socket.write(response);
                        }
                    });
                }
                else if (path === '/user-agent') {
                    const body = headers["user-agent"];
                    const response =
                        'HTTP/1.1 200 OK\r\n' +
                        'Content-Type: text/plain\r\n' +
                        `Content-Length: ${body.length}\r\n` +
                        // 'Connection: close\r\n' +
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
                        // 'Connection: close\r\n' +
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
                        // 'Connection: close\r\n' +
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
            }
        
    });
    socket.on("close", () => {
        socket.end();
    })
})

server.listen(4221, "localhost")
