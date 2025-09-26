import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";


export default [
  layout("layouts/main.tsx", [
    index("routes/products.tsx"),
    route("product/:productId", "routes/product.tsx"),
    route("cart", "routes/cart.tsx"),
  ]),
] satisfies RouteConfig;
