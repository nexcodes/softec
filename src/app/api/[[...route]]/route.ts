
import { handle } from "hono/vercel";

import { authMiddleware } from "./middleware";
import { HTTPException } from "hono/http-exception";


const app = new Hono().basePath("/api");

app.get("/hello", authMiddleware, (c) => {
  return c.json({ message: "Hello, World!" });
});

app.onError((err, c) => {
  console.log(err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ message: "Internal Error" }, 500);
});

const routes = app
  // .route("/summary", summary)
  // .route("/accounts", accounts)
  // .route("/categories", categories)
  // .route("/transactions", transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
