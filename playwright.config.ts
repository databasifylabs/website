import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:4400" },
  webServer: {
    command: "npx serve out -l 4400",
    url: "http://localhost:4400",
    reuseExistingServer: !process.env.CI,
  },
});
