<template>
    <div>
        <div class="title">Venus Interactive Map</div>
        <div class="main-layout">
            <div class="animation-left-column">
                <div class="left-column">
                    <DescriptionSide />
                </div>
            </div>
            <div class="animation-map-box">
                <div class="map" ref="mapContainer"></div>
            </div>
            <div class="animation-right-column">
                <div class="status-column">
                    <StatusIndicators ref="statusIndicators" />
                    <RobotStatus />
                    <MapReset @reset-map="handleResetMap" />
                </div>
            </div>
        </div>
        <div class="animation-bottom-box">
            <div class="box-console">
                <div class="box-content" ref="consoleOutput"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
import { mqttConnect } from "./middleware/connections.js";
import { initThree, updateScene } from "./middleware/graphics/threeInit.js";
import { eventBus } from "./main.js";
import DescriptionSide from "./components/DescriptionSide.vue";
import StatusIndicators from "./components/StatusIndicators.vue";
import RobotStatus from "./components/RobotStatus.vue";
import MapReset from "./components/MapReset.vue";

const mapContainer = ref(null);
const sceneRef = ref(null);
const gridMeshRef = ref(null);
const cylinderRef = ref(null);
const cameraRef = ref(null);
const rendererRef = ref(null);
const consoleOutput = ref(null);
const statusIndicators = ref(null);
const localMapData = ref([]);
const mapDataFilePath = "map-data.json";

const robotId = 21;
const topic_send = `/pynqbridge/${robotId}/send`;
const topic_receive = `pynqbridge/${robotId}/recieve`;

const saveMapData = async (data) => {
    try {
        await writeTextFile(mapDataFilePath, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving map data:", error);
    }
};

const loadMapData = async () => {
    try {
        const data = await readTextFile(mapDataFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading map data:", error);
        return [];
    }
};

const mergeMapData = (localData, newData) => {
    const dataMap = new Map(
        localData.map((item) => [`${item.x},${item.y}`, item]),
    );

    newData.forEach((newItem) => {
        const key = `${newItem.x},${newItem.y}`;

        if (newItem.element_type) {
            dataMap.set(key, {
                x: newItem.x,
                y: newItem.y,
                element_type: newItem.element_type,
            });
        }
    });

    return Array.from(dataMap.values());
};

const handleResetMap = async (emptyMapData) => {
    try {
        if (sceneRef.value && gridMeshRef.value && cylinderRef.value) {
            updateScene(
                sceneRef.value,
                gridMeshRef.value,
                emptyMapData,
                cylinderRef.value,
                rendererRef.value,
                cameraRef.value
            );
            localMapData.value = emptyMapData; // Reset local map data
            await saveMapData(localMapData.value);
        } else {
            console.error("Scene, gridMesh, or cylinder not initialized");
        }
    } catch (error) {
        console.error("Error in handleResetMap:", error);
    }
};

const handleMQTTMessage = async (topic, message) => {
    console.log(
        `(App.vue) ->Received message on topic ${topic}: ${message.toString()}`,
    );
    try {
        const jsonData = JSON.parse(message.toString());
        if (Array.isArray(jsonData)) {
            if (sceneRef.value && gridMeshRef.value && cylinderRef.value) {
                // Extract robot position
                const robotPosition = jsonData.find(item => item.robotX !== undefined && item.robotY !== undefined);

                // Filter out the robot position data from the map elements
                const mapElements = jsonData.filter(item => item.element_type);

                const updatedMapData = mergeMapData(
                    localMapData.value,
                    mapElements
                );

                console.log("New Map Data: ", updatedMapData);
                console.log("Robot Position: ", robotPosition);

                updateScene(
                    sceneRef.value,
                    gridMeshRef.value,
                    updatedMapData,
                    cylinderRef.value,
                    robotPosition
                );
                statusIndicators.value.updateStatus("receivingRobotInfo", true);

                localMapData.value = updatedMapData; // Update local map data
                await saveMapData(localMapData.value); // Save updated map data
            } else {
                console.error("Scene, gridMesh, or cylinder not initialized");
            }
        } else {
            console.error("Received data is not an array");
        }
    } catch (error) {
        console.error("Error parsing message data:", error);
    }
};

onMounted(async () => {
    mqttConnect(topic_send, handleMQTTMessage);
    invoke("start_mosquitto");

    consoleOutput.value.$log = window.console;
    const originalLog = console.log;
    console.log = function (...args) {
        const logElement = document.createElement("div");
        logElement.classList.add("log");
        logElement.textContent = args.join(" ");
        consoleOutput.value.appendChild(logElement);
        originalLog.apply(console, args);
    };

    eventBus.on("mqttConnected", () => {
        if (statusIndicators.value) {
            statusIndicators.value.updateStatus("mqttConnected", true);
        }
    });

    eventBus.on("mqttDisconnected", () => {
        if (statusIndicators.value) {
            statusIndicators.value.updateStatus("mqttConnected", false);
        }
    });

    eventBus.on("mqttReconnecting", () => {
        if (statusIndicators.value) {
            statusIndicators.value.updateStatus("mqttConnected", false);
        }
    });

    eventBus.on("mqttRecv", () => {
        if (statusIndicators.value) {
            statusIndicators.value.updateStatus("mqttRecv", true);
        }
    });

    if (statusIndicators.value) {
        statusIndicators.value.updateStatus("mapBeingGenerated", true);
    }

    nextTick(async () => {
        const { scene, gridMesh, camera, renderer, controls, cylinder } =
            initThree(mapContainer);
        sceneRef.value = scene;
        gridMeshRef.value = gridMesh;
        cylinderRef.value = cylinder;
        cameraRef.value = camera;
        rendererRef.value = renderer;

        localMapData.value = await loadMapData(); // Load existing map data
        updateScene(scene, gridMesh, localMapData.value, cylinder); // Update the scene with existing data
    });
});

onBeforeUnmount(() => {
    appWindow.listen("tauri://close-requested", () => {
        invoke("stop_mosquitto");
    });
});
</script>

<style scoped>
/* CSS Styles */

.title {
    position: relative;
    text-align: center;
    margin-bottom: 10px;
    font-size: larger;
}

.main-layout {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 10px;
}

.left-column {
    margin-right: 10px;
}

.animation-left-column {
    animation: rightBox 0.5s ease-in forwards;
}

.animation-right-column {
    animation: leftBox 0.5s ease-in forwards;
}

.animation-bottom-box {
    animation: topBox 0.5s ease-in forwards;
}

.animation-map-box {
    animation: mapBox 0.5s ease-in forwards;
}

.box-content {
    text-align: left;
    height: 100%;
    font-family: poppins;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    color: #0f0f0f;
    background-color: white;
    white-space: pre-wrap;
    word-break: break-all;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: scroll;
}

.box-content::-webkit-scrollbar {
    display: none;
}

.box-content .log {
    color: black;
}

.box-content -info {
    color: blue;
}

.box-content -warn {
    color: orange;
}

.box-content -error {
    color: red;
}

.map {
    border-radius: 20px;
    border: 2px solid black;
    margin-right: 10px;
    width: 1000px;
    height: 730px;
    overflow: hidden;
}

.map>canvas {
    border-radius: 20px;
}

.status-column {
    display: flex;
    flex-direction: column;
}
</style>
