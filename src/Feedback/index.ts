export const Labels = [
    { name: '添加词汇', value: 'ADD_WORDS' },
    { name: '翻译错误', value: 'TRANSLATE_ERROR' },
    { name: '添加屏蔽词汇', value: 'ADD_NOT_ALLOWED' },
    { name: '汇报一个 Tag 编辑器 的 BUG', value: 'RUNTIME_BUG' },

    {
        name: '汇报一个 上传 的 BUG',
        value: 'UPLOAD_BUG',
    },
    {
        name: '汇报一个 画廊 的 BUG',
        value: 'GALLERY_BUG',
    },
    {
        name: '汇报一个 魔咒生成器 的错误',
        value: 'RANDOM_MAKE_BUG',
    },
    {
        name: '汇报一个 TAG 搜索 的 BUG',
        value: 'TAG_SEARCH_BUG',
    },

    {
        name: '感谢作者',
        value: 'Thanks',
    },
    {
        name: '添加友链',
        value: 'MAKE_FRIENDS',
    },
    {
        name: '其他 BUG',
        value: 'OTHER_BUG',
    },
] as const;
type TupleToUnion<T extends any[]> = T[number]['value'];
/**@ts-ignore */
export type FeedBackTags = TupleToUnion<typeof Labels> | 'bot';
export interface FeedBackMessage {
    title: string;
    body: string;
    labels: FeedBackTags[];
}
/** 提交一个 BUG */
export const commitFeedBack = async (data: FeedBackMessage) => {
    return fetch('https://api.github.com/repos/KonghaYao/ai-tag/issues', {
        method: 'POST',
        headers: {
            accept: 'application/vnd.github+json',
            Authorization: 'Bearer ' + import.meta.env.VITE_GITHUB_TOKEN,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then<string>((res) => res.html_url);
};
