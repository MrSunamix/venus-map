import { createApp } from "vue";
import App from "./App.vue";
import mitt from "mitt";
import "./styles.css";
import posthogPlugin from "./plugins/posthog";

const app = createApp(App);
const eventBus = mitt();

const eventBusPlugin = {
  install(app) {
    app.config.globalProperties.$eventBus = eventBus;
  },
};

app.config.globalProperties.$log = window.console

app.use(eventBusPlugin);
app.use(posthogPlugin);

app.mount("#app");

export { eventBus };
