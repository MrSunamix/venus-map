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

client.on("connect", () => {
  console.log("(robotBehaviour) -> Connected to MQTT broker");
  client.subscribe("/pynqbridge/21/recv", (err) => {
    if (err) {
      console.error("(robotBehaviour) -> Error subscribing to pynq/21/recv:", err);
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === "/pynqbridge/21/recv") {
    const jsonData = JSON.parse(message.toString());
    // Process the data to draw the map
    eventBus.emit("drawMap", jsonData);

    // Re-publish the received message
    client.publish("/pynqbridge/21/send", message.toString());
  }
});

client.on("error", (err) => {
  console.error("(robotBehaviour) -> MQTT Error:", err);
});

export function cleanup() {
  client.unsubscribe("robot/map");
  client.end();
}
