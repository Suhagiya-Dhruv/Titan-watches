const WebSocket = require('ws');
const http = require('http');
const url = require('url');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map(); // store the all client connections

function getClientIdFromUrl(requestUrl) {
    const parsedUrl = url.parse(requestUrl, true);
    return parsedUrl.query && parsedUrl.query.id ? parsedUrl.query.id : null;
}

wss.on('connection', (ws, req) => {
    console.log('Client connected');

    const clientId = getClientIdFromUrl(req.url); // get the screen id
    if (!clientId) {
        ws.close();
        return;
    }

    clients.set(clientId, ws); // set the client connection base on client id

    ws.on('message', (message) => {
        const data = JSON.parse(message)
        if (data === "stop" || data === "start") {
            wss.clients.forEach((client) => { // if user click the watch then send message to all client to stop falling down watches
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
            return;
        }
        data.y = -data.watchHeight
        sendMessageToClient(data.currScreen, data)
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function sendMessageToClient(clientId, message) {
    const client = clients.get(`screen-${clientId}`);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message)); // send message to client 
    } else {
        console.error(`Client with ID ${clientId} not found or not ready.`);
    }
}

server.listen(3000, () => {
    console.log('WebSocket server is listening on port 3000');
});
