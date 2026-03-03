export interface VersionInfo {
  appVersion: string;
  bundleVersion: string;
}

export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "unknown";
export const BUNDLE_VERSION = import.meta.env.VITE_APP_BUNDLE_VERSION || "bundled-1.0.0";

export const versionInfo: VersionInfo = {
  appVersion: APP_VERSION,
  bundleVersion: BUNDLE_VERSION,
};