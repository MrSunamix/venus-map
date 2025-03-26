//./plugins/posthog.js
import posthog from "posthog-js";

export default {
  install(app) {
    app.config.globalProperties.$posthog = posthog.init(
      'phc_cYXAekUzfw8ZDpDcP4j9xqa6BSBNaXCQ8KUuMNDBQjW',
      {
        api_host: 'https://us.i.posthog.com',
      }
    );
  },
};