import { createEffect, untrack } from 'solid-js';
import { Atom, AtomTypeSymbol, atom, resource } from '@cn-ui/use';
import type { ITagData, IStoreData } from '../app/main/App';
import { TagsToString, stringToTags } from '../use/TagsConvertor';
import { useHistory } from '../use/useTagHistory';
import { Message } from '@cn-ui/core';
import { GlobalData } from './GlobalData';
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
export function initGlobalTags() {
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
    const context = {
        lists,
        usersCollection,
        searchText: atom(''),
        TagsHistory,
        redo,
        undo,
    };
    GlobalData.register('tag-control', context);
    return context;
}
