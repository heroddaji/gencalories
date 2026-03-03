import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
const FALLBACK_BUNDLE_VERSION = "bundled-1.0.0";
const resolveBundleVersion = () => {
    if (process.env.VITE_APP_BUNDLE_VERSION) {
        return process.env.VITE_APP_BUNDLE_VERSION;
    }
    try {
        const head = execSync("git rev-parse --short=8 HEAD", { encoding: "utf-8" }).trim();
        if (head) {
            return head;
        }
    }
    catch {
        // ignore and fall back
    }
    return FALLBACK_BUNDLE_VERSION;
};
const resolveAppVersion = () => {
    if (process.env.VITE_APP_VERSION) {
        return process.env.VITE_APP_VERSION;
    }
    return Math.floor(Date.now() / 1000).toString();
};
const APP_VERSION = resolveAppVersion();
const BUNDLE_VERSION = resolveBundleVersion();
export default defineConfig({
    define: {
        "import.meta.env.VITE_APP_VERSION": JSON.stringify(APP_VERSION),
        "import.meta.env.VITE_APP_BUNDLE_VERSION": JSON.stringify(BUNDLE_VERSION),
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
