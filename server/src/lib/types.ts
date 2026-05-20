import type { AppSession } from "./session";

export type AppVariables = {
    session: AppSession;
    session_key_rotation: boolean;
};
