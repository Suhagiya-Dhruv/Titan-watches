let ws;
let connected = false;
function init(id,callback) {
  ws = new WebSocket(`ws://localhost:3000?id=${id}`);

  ws.onopen = () => {
    console.log('WebSocket connection opened');
    connected = true;
  };

  ws.onmessage = callback;

  ws.onerror = (error) => {
    console.error('WebSocket error');
    connected = false;
  };

  ws.onclose = (event) => {
    console.log('WebSocket connection closed');
    connected = false;
  };
}

function sendMessage(message) {
  ws.send(JSON.stringify(message));
}

function close() {
  ws.close();
}

function connectedCheck() {
  return connected;
}

const WebsocketService = {
  init,
  sendMessage,
  close,
  connectedCheck,
};

export default WebsocketService;
