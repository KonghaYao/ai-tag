import { pick } from 'lodash-es';
import { nanoid } from 'nanoid';
import type { GlobalGPT } from '../../api/prompt-gpt';
import type { AllModelName } from '../../api/prompt-gpt/CNModelName';
export interface Comment {}

export interface Article {
    id: string;
    content: BaseBlock[];
}

export class BaseBlock {
    constructor(text?: string) {
        if (text) this.content.text = text;
    }
    id: string = nanoid();
    static label = '基本模块';
    readonly type: string = 'base';
    history: string[] = []; // 根据 id 获取到历史 Block
    content: {
        text: string;
    } = { text: '' };
    comment: Comment[] = [];
    toJSON() {
        return pick(this, ['id', 'type', 'history', 'content', 'comment']);
    }
    fromJSON(
        json: ReturnType<BaseBlock['toJSON']>,
        /** 是否使用 这个类自带的 type 字段 */
        useThisType = true
    ) {
        Object.assign(this, { ...json, type: useThisType ? this.type : json.type });
        return this;
    }
    supportAI = [] as readonly (keyof typeof AllModelName)[];
    transTo(ClassObject: this['canTransTo'][0]) {
        const copied = new ClassObject().fromJSON(this.toJSON());
        copied.history = [this.id, ...this.history];
        return copied;
    }
    canTransTo = [TextBlock, TagsBlock];
}

export class TextBlock extends BaseBlock {
    readonly type = 'text';
    static label = '文本模块';
    supportAI = [
        'textToTags',
        'TagsToText',
        'textToText',
        'StyleTags',
        'ContinueWriting',
        'AskAnything',
    ] as const;
    canTransTo = [TagsBlock];
}
export class TagsBlock extends BaseBlock {
    readonly type = 'tags';
    static label = '标签模块';
    supportAI = ['TagsToText'] as const;
    canTransTo = [TextBlock];
}
const em = {
    text: TextBlock,
    tags: TagsBlock,
};
export const createBlockByType = (type: keyof typeof em) => {
    return new em[type]();
};
