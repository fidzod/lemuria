import type { ErrorHandler } from "hono";
import { err } from "../lib/response";
import { HTTPException } from "hono/http-exception";

export const errorHandler: ErrorHandler = (error, c) => {
    if (error instanceof HTTPException) {
        return err(c, error.message, error.status);
    }

    // Unexpected error
    console.error("Unhandled error:", error);
    return err(c, "Internal server error", 500);
};
