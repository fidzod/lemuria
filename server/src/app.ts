import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { healthRouter } from "./routes/health";
import { err } from "./lib/response";
import { Hono, type Context } from "hono";
import { errorHandler } from "./middleware/error-handler";

export const app = new Hono()
    .use("*", logger())
    .use("*", secureHeaders())
    .use(
        "*",
        cors({
            origin: ["http://localhost:5173"],
            allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowHeaders: ["Content-Type", "Authorization"],
        }),
    )

    .route("/api/v1/health", healthRouter)

    .notFound((c: Context) => err(c, "Not found", 404))

    .onError(errorHandler);
