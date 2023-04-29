import QueryString from 'qs';

export const PromptStoreAPI = {
    searchPrompt(input: {
        q: string;
        type: number;
        limit: string | number;
        offset: string | number;
    }) {
        return fetch(
            `https://prompt-database.deno.dev/search?` + QueryString.stringify(input)
        ).then((res) => res.json());
    },
    random(type: number) {},
};
