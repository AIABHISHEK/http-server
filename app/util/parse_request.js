function getStatusText(code) {
    const statusTexts = {
        200: "OK",
        201: "Created",
        204: "No Content",
        301: "Moved Permanently",
        302: "Found",
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        413: "Payload Too Large",
        415: "Unsupported Media Type",
        500: "Internal Server Error",
        501: "Not Implemented",
        503: "Service Unavailable"
    };
    return statusTexts[code] || "Unknown";
}

/**
    * Returns the status text for a given HTTP status code.
    * @param {number} code - The HTTP status code.
    * @return {string} The corresponding status text.
    */

export function buildResponse({statusCode, headers = {}, body = ''}, incomingHeaders = {}) {
    // Default headers
    console.log('Building response with status code:', statusCode);
    const defaultHeaders = {
        'Content-Type': 'text/plain',
        'Connection': 'close',
        'Content-Length': Buffer.byteLength(body).toString()
    };

    const finalHeaders = { ...defaultHeaders, ...headers };
    if (incomingHeaders['accept-encoding']) {
        if( incomingHeaders['accept-encoding'].includes('gzip')) {
            finalHeaders['Content-Encoding'] = 'gzip';
            // Note: In a real implementation, you would compress the body here
            // For now, we will just set it as is
        }
    }
    const response = `HTTP/1.1 ${statusCode} ${getStatusText(statusCode)}\r\n` +
        Object.entries(finalHeaders)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\r\n') +
        '\r\n\r\n' +
        body;
    return response;
}


/**
 * Parses a raw HTTP request string into an object.
 * The function extracts the method, path, HTTP version, headers, and body from the request.
 * @param {string} raw - The raw HTTP request string.
 * @return {Object} An object containing the method, path, HTTP version, headers, and body.
 * 
 */
export function parseHttpRequest(raw) {
    // Split headers and body
    const [headerPart, ...bodyParts] = raw.split('\r\n\r\n');
    const body = bodyParts.join('\r\n\r\n');

    // Split lines
    const lines = headerPart.split('\r\n');
    const [requestLine, ...headerLines] = lines;

    // Parse request line
    const [method, path, httpVersion] = requestLine.split(' ');

    // Parse headers
    const headers = {};
    for (const line of headerLines) {
        const [key, ...rest] = line.split(':');
        if (key && rest.length > 0) {
            headers[key.trim().toLowerCase()] = rest.join(':').trim();
        }
    }

    return {
        method,
        path,
        httpVersion,
        headers,
        body
    };
}
