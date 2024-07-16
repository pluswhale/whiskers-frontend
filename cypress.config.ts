import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/dev',
    viewportHeight: 896,
    viewportWidth: 414,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
    defaultCommandTimeout: 7000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
