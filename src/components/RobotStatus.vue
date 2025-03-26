<template>
    <div class="last-box">
        <span class="box-title">Robot Status</span>
        <p>Which robot is working:</p>
        <div class="robot-selection">
            <div class="grabber" :class="{ selected: selected === 'grabber' }">
                Grabber
            </div>
            <div class="mapper" :class="{ selected: selected === 'mapper' }">
                Mapper
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RobotStatus",
    data() {
        return {
            selected: "grabber",
        };
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

.robot-selection {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.selected {
    border: 2px solid red;
    border-radius: 20px;
    padding-left: 5px;
    padding-right: 5px;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
