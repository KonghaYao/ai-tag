import { expose, windowEndpoint } from 'comlink';
import { DebouncedFunc, debounce } from 'lodash-es';
import { createEffect, on, useContext } from 'solid-js';
import type { Data, ITagData } from '../app/main/App';
import { stringToTags, TagsToString } from '../use/TagsConvertor';
import { CombineMagic } from '../utils/CombineMagic';
import { GlobalData } from '../store/GlobalData';

/**
 * 可以对外提供 iframe 服务，但是现在没有在用
 * @deprecated 因为没有人用
 */
export const useIframeExpose = () => {
    const { usersCollection } = GlobalData.getApp('tag-control')!;
    if (self != top) {
        let callbacks: DebouncedFunc<(data: ITagData[]) => void>[] = [];
        createEffect(
            on(usersCollection, (data) => {
                callbacks.forEach((i) => i(data));
            })
        );
        console.log('APP 模式挂载接口');
        const api = {
            /** 载入 prompt 字符串，但是以融合的方式 */
            inputPrompt(promptString: string) {
                usersCollection(() => stringToTags(promptString));
                return true;
            },

            onPromptChange(cb: any) {
                const sendBack = debounce(() => {
                    cb(TagsToString(usersCollection(), '()', true));
                }, 200);
                callbacks.push(sendBack);
            },
            /** 载入 prompt 字符串，但是以合并的方式 */
            combinePrompt(promptString: string) {
                usersCollection(CombineMagic(stringToTags(promptString), usersCollection()));
                return true;
            },
            /** 获取 prompt 字符串 */
            getPrompt() {
                return TagsToString(usersCollection());
            },
            /** 获取 prompt 数组 */
            getPromptData() {
                return usersCollection();
            },
        };
        expose(api, windowEndpoint(self.parent));
    }
};
