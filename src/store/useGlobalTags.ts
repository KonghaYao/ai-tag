import { createEffect, untrack } from 'solid-js';
import { Atom, AtomTypeSymbol, atom, resource } from '@cn-ui/use';
import type { ITagData, IStoreData } from '../app/main/App';
import { TagsToString, stringToTags } from '../use/TagsConvertor';
import { useHistory } from '../use/useTagHistory';
import { Message } from '@cn-ui/core';
import { GlobalData } from './GlobalData';
import { CombineMagic } from '../utils/CombineMagic';
import { Notice } from '../utils/notice';
import { useTranslation } from '../i18n';
export const cdn = 'https://cdn.jsdelivr.net/npm';

const useOwnAtom = () => {
    // 添加去重功能的 Atom，实现较拉😂
    const usersCollection = atom<ITagData[]>([]);
    const changeUsersCollection = usersCollection.reflux(usersCollection(), (data) =>
        data.filter(
            (item: ITagData, index: number) =>
                item &&
                (item.text === '\n' ||
                    (data as ITagData[]).findIndex((next) => next.en === item.en) === index)
        )
    );
    return Object.assign(
        function () {
            if (arguments.length === 0) {
                return usersCollection();
            } else {
                /** @ts-ignore */
                return changeUsersCollection(...(arguments as any));
            }
        },
        { [AtomTypeSymbol]: 'atom' }
    ) as any as Atom<ITagData[]>;
};

export type ITagStore = ReturnType<typeof initGlobalTags>;

/** 加载 Tag 数据库,  */
export function initGlobalTags(data: IStoreData) {
    console.log('重绘');
    const lists = atom([] as ITagData[]);

    const usersCollection = useOwnAtom();

    /**直接进行一个历史存储 */
    const TagsHistory = useHistory<string>();
    const undo = () => {
        const res = TagsHistory.back();
        if (res) {
            const old = TagsToString(usersCollection());
            usersCollection(stringToTags(res, lists()));
            TagsHistory.addToHistory(old, false);
            Message.success('撤销成功');
        }
    };
    const redo = () => {
        const res = TagsHistory.go();
        if (res) {
            usersCollection(stringToTags(res, lists()));
            Message.success('恢复成功');
        }
    };
    const searchText = atom('');
    const result = resource(
        () =>
            fetch('https://able-hare-95.deno.dev/tags', {
                method: 'POST',
                body: JSON.stringify({
                    text: searchText(),
                    options: {
                        filter: !data.r18Mode() && `r18 != 1`,
                    },
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    return res.hits as ITagData[];
                }),
        { initValue: [], immediately: false, deps: [searchText] }
    );
    const context = {
        lists,
        result,
        searchText,
        usersCollection,
        TagsHistory,
        redo,
        undo,
        injectTags: (
            old: ITagData[],
            input: ITagData[],
            isCombine = false,
            isTailAdd = false,
            uc = usersCollection
        ) => {
            const { t } = useTranslation();
            if (isCombine) {
                const list = CombineMagic(input, old);
                uc(list);
                Message.success(t('publicPanel.hint.CombineSuccess'));
            } else if (isTailAdd) {
                uc((i) => [...i, ...input]);
                Notice.success(t('publicPanel.hint.CopySuccess'));
            } else {
                uc(input);
                Notice.success(t('publicPanel.hint.CopySuccess'));
            }
        },
    };
    GlobalData.register('tag-control', context);
    return context;
}
