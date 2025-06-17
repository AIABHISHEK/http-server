const net = require("net");
const fs = require("fs");
const { parseHttpRequest, buildResponse, endOfRequest } = require("./util/util.js");
const PATH = require('path');
const { handleRoute } = require("./route/route.js");

console.log("Logs from your program will appear here!");

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
                
                handleRoute({ req: { method, url: path, body, headers }, socket });
            }
        
    });
    socket.on("close", () => {
        socket.end();
    })
})

server.listen(4221, "localhost")
