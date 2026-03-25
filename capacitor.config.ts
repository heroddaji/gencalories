import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "net.nevitech.gencalories",
  appName: "GenCalories",
  webDir: "dist",
  plugins: {
    LiveUpdate: {
      appId: "f912409e-94bd-4072-9dc6-e3f1f4df981a",
      autoUpdateStrategy: "background",
    },
  },
};

export default config;
