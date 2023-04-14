import type { GlobalGPT } from '../prompt-gpt';

/** 需要 token 模型的 enum */
export const ProModelName = {
    ContinueWriting: '✏️续写',
    AskAnything: '🤔提问',
};
/** 基础模型的 enum */
export const BaseModelName = {
    textToTags: '🏷️文生词',
    TagsToText: '🔤词生文',
    textToText: '📜文生文',
    StyleTags: '🏞️风格词汇',
};

export const AllModelName = { ...BaseModelName, ...ProModelName };

export const CNModelName = { ...BaseModelName, ...ProModelName } as {
    [A in keyof typeof GlobalGPT]: string;
};
