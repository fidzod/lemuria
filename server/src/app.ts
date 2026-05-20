import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { healthRouter } from "./routes/health";
import { err } from "./lib/response";
import { Hono, type Context } from "hono";
import { errorHandler } from "./middleware/error-handler";
import { session } from "./lib/session";
import { authRouter } from "./routes/auth";

export const app = new Hono()
    .use("*", logger())
    .use("*", secureHeaders())
    .use(
        "*",
        cors({
            origin: ["http://localhost:5173"],
            allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }),
    )

    .use("*", session)

    .route("/api/v1/health", healthRouter)
    .route("/api/v1/auth", authRouter)

    .notFound((c: Context) => err(c, "Not found", 404))

    .onError(errorHandler);
