import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [
    reactRouter(),
    {
      name: "ignore-chrome-devtools-request",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/.well-known/appspecific/com.chrome.devtools.json") {
            res.writeHead(204); // No Content
            res.end();
          } else {
            next();
          }
        });
      },
    },
  ],
});
