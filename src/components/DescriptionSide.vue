<template>
    <div class="flex-list">
        <div class="container">
            <div class="box-1">
                <span class="box-title">Description of APP</span>
                <div class="box-content">
                    <p>
                        This is the map generation self-hosted application for
                        the CBL of Venus Challenge.
                    </p>
                    <p>
                        Its purpouse is to listen on the MQTT channels and
                        assess the information wisely.
                    </p>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="box-2">
                <span class="box-title">Legend</span>
                <div class="box-content">
                    <p>
                        The following items with their respective colors are
                        used:
                    </p>
                    <p>White - Mountains</p>
                    <p>Black - Cliffs</p>
                    <p>Colored spheres - Rocks</p>
                    <p>Fuxia/Pink - Robot</p>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="box-3">
                <span class="box-title">Controls</span>
                <div class="options">
                    <div class="positioning">
                        <p>Real</p>
                        <label class="switch">
                            <input type="checkbox" />
                            <span class="slider round"></span>
                        </label>
                        <p>Fictional (WIP)</p>
                    </div>
                    <div class="positioning">
                        <p>Automatic</p>
                        <label class="switch">
                            <input type="checkbox" @change="toggleControlMode" v-model="isManual" />
                            <span class="slider round"></span>
                        </label>
                        <p>Manual</p>
                    </div>
                    <transition name="fade">
                        <div class="positioning" v-if="isManual">
                            <p>Grabber</p>
                            <label class="switch">
                                <input type="checkbox" @change="toggleControlMode" v-model="isGrabber" />
                                <span class="slider round"></span>
                            </label>
                            <p>Mapper (WIP)</p>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DescriptionSide",
    data() {
        return {
            isManual: false,
            currentCleanup: null,
        };
    },
    methods: {
        async toggleControlMode() {
            if (this.currentCleanup) {
                this.currentCleanup();
            }

            if (this.isManual) {
                const module = await import(
                    "/src/middleware/controls/robotControls.js"
                );
                this.currentCleanup = module.cleanup;
            } else {
                const module = await import(
                    "/src/middleware/controls/robotBehaviour.js"
                );
                this.currentCleanup = module.cleanup;
            }
        },
    },
    async mounted() {
        const module = await import(
            "/src/middleware/controls/robotBehaviour.js"
        );
        this.currentCleanup = module.cleanup;
    },
};
</script>

<style>
@import "./../styles.css";

.flex-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -20px;
}

.options {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.positioning {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
}

.positioning p {
    margin: 0 10px;
}

.legend {
    border-radius: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: black;
    width: 320px;
    height: 300xp;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.box-content {
    justify-content: left;
}
</style>
