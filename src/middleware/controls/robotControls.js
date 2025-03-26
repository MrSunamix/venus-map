import mqtt from "mqtt";

const brokerUrl = "ws://localhost:9001";
const options = {
  keepalive: 30,
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 500,
  connectTimeout: 30 * 1000,
};

const client = mqtt.connect(brokerUrl, options);
const topic = "/pynqbridge/21/recv";

let sendDataInterval = null;
let direction = null;

client.on("connect", () => {
  console.log("(robotControls) -> Connected to MQTT broker");

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
});

function handleKeyDown(event) {
  if (sendDataInterval) return; // Prevents multiple intervals for the same key

  switch (event.key) {
    case "ArrowUp":
      direction = "forward";
      break;
    case "ArrowDown":
      direction = "backward";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
    default:
      return; // Quit for other keys
  }

  sendDataInterval = setInterval(() => {
    let message;
    switch (direction) {
      case "forward":
        message = JSON.stringify({
          left: 400,
          right: 400,
          rspeed: 16000,
          lspeed: 16000,
        });
        break;
      case "backward":
        message = JSON.stringify({
          left: 400,
          right: 400,
          rspeed: -16000,
          lspeed: -16000,
        });
        break;
      case "left":
        message = JSON.stringify({
          left: 400,
          right: 400,
          rspeed: 0,
          lspeed: -16000,
        });
        break;
      case "right":
        message = JSON.stringify({
          left: 400,
          right: 400,
          rspeed: 0,
          lspeed: 16000,
        });
        break;
      default:
        console.log("Invalid direction");
        return;
    }
  
    client.publish(topic, message, (error) => {
      if (error) {
        console.error("(robotControls) -> Error publishing data:", error);
      } else {
        console.log("(robotControls) -> Data published:", message);
      }
    });
  }, 100); // Send data every 100ms
}

function handleKeyUp(event) {
  if (!event.key.startsWith("Arrow")) return;

  clearInterval(sendDataInterval);
  sendDataInterval = null;
  direction = null; // Reset direction
}

client.on("error", (err) => {
  console.error("(robotControls) -> MQTT Error:", err);
});

export function cleanup() {
  clearInterval(sendDataInterval);
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
  client.end();
}