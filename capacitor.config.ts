import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gencalories.app",
  appName: "GenCalories",
  webDir: "dist",
  bundledWebRuntime: false,
  plugins: {
    LiveUpdate: {
      appId: "f912409e-94bd-4072-9dc6-e3f1f4df981a",
      autoUpdateStrategy: "background",
    },
  },
};

export default config;
