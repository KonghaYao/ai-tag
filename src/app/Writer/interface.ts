import { pick } from 'lodash-es';
import { nanoid } from 'nanoid';
import type { GlobalGPT } from '../../api/prompt-gpt';
import type { AllModelName } from './Editor/Common/AIPlace';
export interface Comment {}

export interface Article {
    id: string;
    content: BaseBlock[];
}
export class BaseBlock {
    id: string = nanoid();
    type: string = 'text';
    history: string[] = []; // 根据 id 获取到历史 Block
    content: {
        text: string;
    } = { text: '' };
    comment: Comment[] = [];
    toJSON() {
        return pick(this, ['id', 'type', 'history', 'content', 'comment']);
    }
    fromJSON(json: ReturnType<BaseBlock['toJSON']>) {
        Object.assign(this, json);
        return this;
    }
    supportAI = [] as readonly (keyof typeof AllModelName)[];
    transTo(ClassObject: typeof BaseBlock) {
        return new ClassObject().fromJSON(this.toJSON());
    }
}

export class TextBlock extends BaseBlock {
    type = 'text';
    supportAI = ['textToTags', 'TagsToText', 'textToText'] as const;
}
export class TagsBlock extends BaseBlock {
    type = 'tags';
    supportAI = ['TagsToText'] as const;
}
const em = {
    text: TextBlock,
    tags: TagsBlock,
};
export const createBlockByType = (type: keyof typeof em) => {
    return new em[type]();
};
