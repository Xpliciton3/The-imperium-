const path = require("path");

require("dotenv").config();

const isDevServer = process.env.NODE_ENV !== "production";
const enableHealthCheck = process.env.ENABLE_HEALTH_CHECK === "true";

let healthPluginInstance = null;
let setupHealthEndpoints = null;

if (enableHealthCheck) {
  const WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

let config = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
      }
    }
  },

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },

    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**"
        ]
      };

      if (enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins = webpackConfig.plugins || [];
        webpackConfig.plugins.push(healthPluginInstance);
      }

      return webpackConfig;
    }
  }
};

config.devServer = (devServerConfig) => {
  if (enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }

      setupHealthEndpoints(devServer, healthPluginInstance);
      return middlewares;
    };
  }

  return devServerConfig;
};

if (isDevServer) {
  try {
    const { withVisualEdits } = require("@emergentbase/visual-edits/craco");
    config = withVisualEdits(config);
  } catch (err) {
    const missingVisualEdits =
      err.code === "MODULE_NOT_FOUND" &&
      err.message.includes("@emergentbase/visual-edits/craco");

    if (missingVisualEdits) {
      console.warn(
        "[visual-edits] @emergentbase/visual-edits not installed — visual editing disabled."
      );
    } else {
      throw err;
    }
  }
}

module.exports = config;
