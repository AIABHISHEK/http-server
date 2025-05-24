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
