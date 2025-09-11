import { loadJSON } from "../helpers/loadJSON";

// If config.json is not found and the hostname is localhost or 127.0.0 load config-dev.json
let config = loadJSON("/config.json");

if (!config && ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
  config = loadJSON("/config-dev.json");
  if (!config) {
    config = {
      "BACKEND_PROTOCOL": "http",
      "BACKEND_HOST": "localhost",
      "BACKEND_PORT": "8080",
      "LOG_LEVEL": "debug"
    };
  }
}

if (!config) {
  throw new Error("Config not found");
}

export function getBackendURL() {
  // Detect if accessing via IP address
  const isIPAccess = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
  const backendHost = isIPAccess ? window.location.hostname : (config.BACKEND_HOST || "localhost");
  
  return (
    config.REACT_APP_BACKEND_URL ||
    (config.BACKEND_PROTOCOL ?? "https") + "://" +
    backendHost + ":" + (config.BACKEND_PORT ?? 443) +
    (config.BACKEND_PATH ?? "")
  );
}

export function getBackendSocketURL() {
  // Detect if accessing via IP address
  const isIPAccess = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
  const backendHost = isIPAccess ? window.location.hostname : (config.BACKEND_HOST || "localhost");
  
  return (
    config.REACT_APP_BACKEND_URL ||
    (config.BACKEND_PROTOCOL ?? "https") + "://" +
    backendHost + ":" + (config.BACKEND_PORT ?? 443)
  );
}

export default config;
