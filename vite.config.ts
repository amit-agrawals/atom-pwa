import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import path from "path";
import LCL from "last-commit-log";

const env = process.env;

// Pass the latest commit short hash to the app
const lcl = new LCL();
const commit = lcl.getLastCommitSync();
env.VITE_COMMIT_SHORT_HASH = commit.shortHash;

const prefixEnvVars = ["BRANCH"];

for (const envVar of prefixEnvVars) {
  env[`VITE_${envVar}`] = env[envVar];
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin/index.html"),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: ["firebase/app", "@material-ui/core/ButtonBase"],
    exclude: ["hammerjs"],
  },
  plugins: [reactRefresh(), svgr()],
  alias: {
    "@": path.resolve("./src"),
  },
  dedupe: ["react", "react-dom"],
});
