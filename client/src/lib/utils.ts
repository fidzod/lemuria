export const formatApiError = (
    error: string,
    details?: Record<string, string[]>
): string => {
    if (details === undefined) return error;
    const messages = Object.values(details).flat();
    if (messages.length === 0) return error;
    return messages.join(". ") + '.';
};
