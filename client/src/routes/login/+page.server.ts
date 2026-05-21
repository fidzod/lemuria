import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { api } from "$lib/api";

export const load: PageServerLoad = async ({ parent }) => {
    const { user } = await parent();
    if (user !== null) redirect(302, "/");
    return {};
};

export const actions: Actions = {
    login: async ({ fetch, request }) => {
        const form = await request.formData();
        const identifier = form.get("identifier");
        const password = form.get("password");

        if (typeof identifier !== "string" || typeof password !== "string") {
            return fail(400, { action: "login", error: "Invalid form data" });
        }

        if (identifier.trim().length === 0) {
            return fail(400, { action: "login", error: "Email or username is required" });
        }

        if (password.length === 0) {
            return fail(400, { action: "login", error: "Password is required" });
        }

        const result = await api.auth.login(fetch, identifier.trim(), password);

        if (!result.success) {
            return fail(401, { action: "login", error: result.error });
        }

        redirect(302, "/");
    },

    register: async ({ fetch, request }) => {
        const form = await request.formData();
        const email = form.get("email");
        const username = form.get("username");
        const password = form.get("password");

        if (
            typeof email !== "string" ||
            typeof username !== "string" ||
            typeof password !== "string"
        ) {
            return fail(400, { action: "register", error: "Invalid form data" });
        }

        const result = await api.auth.register(fetch, email.trim(), username.trim(), password);

        if (!result.success) {
            return fail(400, { action: "register", error: result.error });
        }

        redirect(302, "/");
    },

    logout: async ({ fetch }) => {
        await api.auth.logout(fetch);
        redirect(302, "/");
    },
}
