// 这里是管理全局自动翻译的插件位置

// 搜索为全局性质，浮动窗跟随鼠标移动
// 通过黑板机制挂载插件 DOM
// 持久化搜索结果，如果持久化里面有，那么就直接取用，为了不会积累太多，使用 SessionStorage

const Adapter = [
    (input: string, lang: string, toLang: string) => {},
    (input: string, lang: string, toLang: string) => {},
];

export const TranslateEngine = () => {
    for (const engine of Adapter) {
    }
};
