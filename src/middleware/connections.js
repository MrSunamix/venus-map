import mqtt from "mqtt";
import { eventBus } from "../main.js";

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

export const mqttConnect = (topic, handleMQTTMessage) => {
  console.log("(connections.js) -> Attempting to connect to MQTT broker...");
  const client = mqtt.connect(brokerUrl, options);

  client.on("connect", () => {
    console.log("(connections.js) -> Connected to MQTT broker");
    client.subscribe(topic, (err) => {
      if (err) {
        console.error("(connections.js) -> Error subscribing to topic:", err);
      } else {
        eventBus.emit("mqttConnected");
        console.log(`(connections.js) -> Subscribed to topic: ${topic}`);
      }
    });
  });

  client.on("message", (topic, message) => {
    console.log("(connections.js) -> Message received:", topic, message.toString());
    try {
      const jsonData = JSON.parse(message.toString());
      eventBus.emit("parsedJsonData", jsonData);
    } catch (error) {
      console.error("(connections.js) -> Error parsing message data:", error);
    }

    handleMQTTMessage(topic, message);
    eventBus.emit("mqttRecv");
  });

  client.on("offline", () => {
    // Handle MQTT offline status
    eventBus.emit("mqttDisconnected");
  });

  client.on("reconnect", () => {
    // Handle MQTT reconnect
    console.log("(connections.js) -> Attempting to reconnect to MQTT broker...");
    eventBus.emit("mqttReconnecting"); // Emit an event when reconnected
  });

  return client;
};

export { eventBus };
