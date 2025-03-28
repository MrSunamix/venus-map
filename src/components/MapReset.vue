<template>
    <div class="last-box">
        <span class="box-title">Map Reset</span>
        <div class="spacer"></div>
        <button @click="sendResetCommand">
            <span class="text">Reset Map</span>
            <span class="shimmer"></span>
        </button>
    </div>
</template>

<script>
import emptyMapData from "../assets/empty.json";

export default {
    methods: {
        sendResetCommand() {
            console.log("Emitting 'reset-map' event with empty map data");
            for (var i = 0; i < 5; i++) {
                this.$emit("reset-map", emptyMapData);
            }
        },
    },
};
</script>

<style scoped>
@import "./../styles.css";

.spacer {
    margin-bottom: 10px;
}

.last-box {
    position: relative;
    width: 285px;
    background-color: white;
    border: 2px solid black;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
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

/* Button inspired by CodePen user Simon Goenlner*/

@property --shimmer {
    syntax: "<angle>";
    inherits: false;
    initial-value: 33deg;
}

@keyframes shimmer {
    0% {
        --shimmer: 0deg;
    }

    100% {
        --shimmer: 360deg;
    }
}

@keyframes shine {
    0% {
        opacity: 0;
    }

    15% {
        opacity: 1;
    }

    55% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes text {
    0% {
        background-position: 100% center;
    }

    100% {
        background-position: -100% center;
    }
}

button {
    color: var(--bg);
    height: 50px;
    font-weight: 600;
    background-color: white;
    padding: 0.8em 1.4em;
    position: relative;
    isolation: isolate;
    box-shadow:
        0 2px 3px 1px hsl(var(--glow-hue) 50% 20% / 50%),
        inset 0 -10px 20px -10px hsla(var(--shadow-hue), 10%, 90%, 95%);
    border-radius: 0.66em;
    scale: 0.8;
    transition: all var(--spring-duration) var(--spring-easing);
}

button:hover:not(:active),
button.active {
    transition-duration: calc(var(--spring-duration) * 0.5);
    scale: 1;
    box-shadow:
        0 4px 8px -2px hsl(var(--glow-hue) 50% 20% / 50%),
        inset 0 0 0 transparent;
}

button:active {
    scale: 1.1;
    transition-duration: calc(var(--spring-duration) * 0.5);
}

.shimmer {
    position: absolute;
    inset: -40px;
    border-radius: inherit;
    mask-image: conic-gradient(
        from var(--shimmer, 0deg),
        transparent 0%,
        transparent 10%,
        black 36%,
        black 45%,
        transparent 50%,
        transparent 60%,
        black 85%,
        black 95%,
        transparent 100%
    );
    mask-size: cover;
    mix-blend-mode: plus-lighter;
    animation: shimmer 1s linear infinite both;
}

button:hover .shimmer::before,
button:hover .shimmer::after,
button.active .shimmer::before,
button.active .shimmer::after {
    opacity: 1;
    animation: shine 1.2s ease-in 1 forwards;
}

.shimmer::before,
.shimmer::after {
    transition: all 0.5s ease;
    opacity: 0;
    content: "";
    border-radius: inherit;
    position: absolute;
    mix-blend-mode: color;
    inset: 40px;
    pointer-events: none;
}

.shimmer::before {
    box-shadow:
        0 0 3px 2px hsl(var(--glow-hue) 20% 95%),
        0 0 7px 4px hsl(var(--glow-hue) 20% 80%),
        0 0 13px 4px hsl(var(--glow-hue) 50% 70%),
        0 0 25px 5px hsl(var(--glow-hue) 100% 70%);
    z-index: -1;
}

.shimmer::after {
    box-shadow:
        inset 0 0 0 1px hsl(var(--glow-hue) 70% 95%),
        inset 0 0 2px 1px hsl(var(--glow-hue) 100% 80%),
        inset 0 0 5px 2px hsl(var(--glow-hue) 100% 70%);
    z-index: 2;
}

button .text {
    color: black;
    background-clip: text;
    background-color: var(--bg);
    background-image: linear-gradient(
        120deg,
        transparent,
        hsla(var(--glow-hue), 100%, 80%, 0.66) 40%,
        hsla(var(--glow-hue), 100%, 90%, 0.9) 50%,
        transparent 52%
    );
    background-repeat: no-repeat;
    background-size: 300% 300%;
    background-position: center 200%;
}

button:hover .text,
button.active .text {
    animation: text 0.66s ease-in 1 both;
}

/*----------------------------------------------------------------------*/
</style>
