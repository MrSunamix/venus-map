<template>
    <div class="last-box">
        <span class="box-title">Status Indicators</span>
        <div class="status">
            <span class="indicator" :class="mapIndicatorClass"></span>
            <p>Generation of map</p>
        </div>
        <div class="line-spacer"></div>
        <div class="status">
            <span class="indicator" :class="mqttIndicatorClass"></span>
            <p>MQTT connection status</p>
        </div>
        <div class="status">
            <span class="indicator" :class="mqttSendClass"></span>
            <p>MQTT information send</p>
        </div>
        <div class="status">
            <span class="indicator" :class="mqttRecvClass"></span>
            <p>MQTT information receive</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isMapBeingGenerated: false,
            mapIndicatorState: false,
            isMqttConnected: false,
            isMqttSend: false,
            isMqttRecv: false,
        };
    },
    computed: {
        mapIndicatorClass() {
            return this.mapIndicatorState
                ? "map-receiving-information-1"
                : "map-receiving-information-2";
        },
        mqttIndicatorClass() {
            return this.isMqttConnected
                ? "mqtt-successfully-connected"
                : "mqtt-unsuccessful-connection";
        },
        mqttSendClass() {
            return this.isMqttSend
                ? "mqtt-information-send-on"
                : "mqtt-information-send-off";
        },
        mqttRecvClass() {
            return this.isMqttRecv
                ? "mqtt-information-receive-on"
                : "mqtt-information-receive-off";
        },
    },
    methods: {
        updateStatus(status, value) {
            switch (status) {
                case "mapBeingGenerated":
                    this.isMapBeingGenerated = value;
                    break;
                case "mqttConnected":
                    this.isMqttConnected = value;
                    break;
                case "mqttSend":
                    this.isMqttSend = value;
                    setTimeout(() => {
                        this.isMqttSend = false;
                    }, 250);
                    break;
                case "mqttRecv":
                    this.isMqttRecv = value;
                    setTimeout(() => {
                        this.isMqttRecv = false;
                    }, 250);
                    break;
            }
        },
    },
};
</script>

<style scoped>
@import "./../styles.css";

.last-box {
    position: relative;
    width: 285px;
    background-color: white;
    border: 2px solid black;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.legend {
    list-style-type: none;
    padding: 0;
    margin-top: 10px;
}

.legend li {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.legend-indicator {
    width: 10px;
    height: 10px;
    margin-right: 5px;
    border-radius: 50%;
}

.indicator {
    transition-duration: 0.3s;
}
</style>
