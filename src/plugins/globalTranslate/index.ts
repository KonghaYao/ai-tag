// 这里是管理全局自动翻译的插件位置

// 搜索为全局性质，浮动窗跟随鼠标移动
// 通过黑板机制挂载插件 DOM
// 持久化搜索结果，如果持久化里面有，那么就直接取用，为了不会积累太多，使用 SessionStorage

const Adapter = [
    async (input, lang, toLang) => {
        return sessionStorage.getItem(lang + toLang + input);
    },
    async (input, lang, toLang) => {
        // 没有翻译器，那就自己搭一个😂
        return fetch(
            // deno 的速度在大约 500 ms，而render需要 1.5 s，故搞了一个 deno 进行转接
            `https://tranlate-magic-tag.deno.dev/?source=${lang}&target=${toLang}&text=${input}`
        )
            .then((res) => res.json())
            .then((res) => res.result);
    },
] as ((input: string, lang: string, toLang: string) => Promise<string | null>)[];

export const Translate = async (input: string, lang: string, toLang: string) => {
    for (const engine of Adapter) {
        const res = await engine(input, lang, toLang);
        if (typeof res !== 'string') {
            continue;
        } else {
            sessionStorage.setItem(lang + toLang + input, res);
            return res;
        }
    }
    return null;
};
