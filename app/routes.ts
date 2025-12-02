import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("ai-insights", "routes/ai-insights.tsx"),
  route("api/shipments", "routes/api.shipments.ts"),
  route("api/shipments/:id/status", "routes/api.shipments.$id.status.ts"),
] satisfies RouteConfig;
