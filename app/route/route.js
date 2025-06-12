
import PATH from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { buildResponse } from '../util/util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = PATH.dirname(__filename);

export const handleRoute = ({ req, socket }) => {
    const { method, url, body, headers } = req;
    const path = url.split('?')[0]; // Get the path without query parameters

    if (path === '/') {
        const response = buildResponse(
            {
                statusCode: 200,
                headers: {}, body
            },
            headers
        );
        socket.write(response);
    }
    else if (path === '/files') {
        console.log("Request for /files");
        // const filePath = path.replace('/files/', '');
        const fullPath = "data.txt";
        const filePath = PATH.join(__dirname, fullPath);
        console.log("File path:", filePath);
        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                const resbody = 'File Not Found';
                const response = buildResponse({
                    statusCode: 404,
                    headers: { 'Content-Type': 'text/plain', 'Content-Length': resbody.length.toString() },
                    resbody
                }, headers);
                socket.write(response);
                socket.end();
            } else {
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.error("Error reading file:", err);
                        const resbody = 'Internal Server Error';
                        const response = buildResponse({
                            statusCode: 500,
                            headers: {
                                'Content-Type': 'text/plain',
                                'Content-Length': body.length.toString()
                            },
                            resbody
                        }, headers);
                        socket.write(response);
                        socket.end();
                        return;
                    }
                    console.log("File data:", data);
                    const response = buildResponse({
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Length': stats.size.toString(),
                            'Connection': 'keep-alive'
                        },
                        body: data
                    }, headers);
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
                const response = buildResponse({
                    statusCode: 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Internal Server Error'
                }, headers);
                socket.write(response);
            } else {
                const response = buildResponse({
                    statusCode: 201,
                    headers: { 'Content-Type': 'text/plain', 'Content-Length': body.length.toString() },
                    body
                }, headers);
                socket.write(response);
            }
        });
    }
    else if (path === '/user-agent') {
        const resbody = headers["user-agent"];
        const response = buildResponse({
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain', 'Content-Length': body.length.toString() },
            resbody
        }, headers);
        socket.write(response);
    }
    else if (path === '/echo') {
        const resbody = 'Abc echo res!';
        const response = buildResponse({
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain', 'Content-Length': body.length.toString() },
            resbody
        }, headers);
        socket.write(response);
    }
    else if (path.startsWith('/echo/')) {
        const resbody = 'Abc echo res!';
        const response = buildResponse({
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': body.length.toString()
            },
            resbody
        }, headers);
        socket.write(response);
    }
    else {
        const resbody = 'Not Found';
        const response = buildResponse({
            statusCode: 404,
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': body.length.toString()
            },
            resbody
        }, headers);
        socket.write(response);
        console.log("No URL path found in the request.");
    }
}
