export const PromptStoreAPI = {
    searchPrompt(q: string, type: number) {
        return fetch(`https://prompt-database.deno.dev/search?type=${type}&q=` + q).then((res) =>
            res.json()
        );
    },
    random(type: number) {
        return fetch(`https://prompt-database.deno.dev/search?type=${type}`).then((res) =>
            res.json()
        );
    },
};
