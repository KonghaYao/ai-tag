import QueryString from 'qs';

export const PromptStoreAPI = {
    searchPrompt(input: {
        q: string;
        type: number;
        limit: string | number;
        length: string;
        offset: string | number;
    }) {
        return fetch(
            `https://prompt-database.deno.dev/search?` + QueryString.stringify(input)
        ).then((res) => res.json());
    },
    random(type: number) {},
    length: [
        ['所有', ''],
        ['超短', 'veryshort'],
        ['短', 'short'],
        ['中', 'mid'],
        ['长', 'long'],
        ['超长', 'verylong'],
    ] as [string, string][],
};
