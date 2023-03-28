import type { GlobalGPT } from '../prompt-gpt';

export const ProModelName = {
    ContinueWriting: '✏️续写',
    AskAnything: '🤔提问',
};
export const BaseModelName = {
    textToTags: '🏷️文生词',
    TagsToText: '🔤词生文',
    textToText: '📜文生文',
};

export const AllModelName = { ...BaseModelName, ...ProModelName };

export const CNModelName = { ...BaseModelName, ...ProModelName } as {
    [A in keyof typeof GlobalGPT]: string;
};
