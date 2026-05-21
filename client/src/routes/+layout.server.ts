import { api } from "$lib/api";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, request }) => {
    const cookie = request.headers.get("cookie");
    const result = await api.auth.me(
        (input, init) =>
            fetch(input, {
                ...init,
                headers: {
                    ...init?.headers,
                    ...(cookie !== null ? { cookie } : {}),
                },
            })
    );

    if (!result.success) return { user: null };

    return { user: result.data };
};
