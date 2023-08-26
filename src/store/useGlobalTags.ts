import { Atom, AtomTypeSymbol, atom, resource } from '@cn-ui/use';
import type { ITagData, IStoreData } from '../app/main/App';
import { useHistoryTravel } from '../use/useHistoryTravel';
import { Message } from '@cn-ui/core';
import { GlobalData } from './GlobalData';
import { CombineMagic } from '../utils/CombineMagic';
import { Notice } from '../utils/notice';
import { useTranslation } from '../i18n';

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
import { localSync } from '../utils/localSync';
import { TagAPI } from '../api/TagAPI';
/** 加载 Tag 数据库,  */
export function initGlobalTags(data: IStoreData) {
    console.log('重绘');
    const lists = atom([] as ITagData[]);

    const usersCollection = useOwnAtom();

    /**直接进行一个历史存储 */
    const TagsHistory = useHistoryTravel(usersCollection);
    const undo = () => {
        TagsHistory.back();
        Message.success('撤销成功');
    };
    const redo = () => {
        TagsHistory.forward();
        Message.success('恢复成功');
    };
    const searchText = atom('');
    const result = resource(() => TagAPI.searchTags(searchText(), data.r18Mode()), {
        initValue: [],
        immediately: false,
        deps: [searchText],
    });

    // 使用页面上次的呈现先fallback一下，保证用户看得见东西
    localSync(result, 'the_search_data_of_main_page');
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
