import { Atom, atom } from '@cn-ui/use';
import type { PanelIds } from '../app/main/SideApp';
import { useStorage } from '../use/useStorage';

const ObjectToAtoms = <T extends Object>(
    obj: T
): {
    [S in keyof T]: Atom<T[S]>;
} => {
    /** @ts-ignore ignore: 签名是对的，但是主动识别错误了 */
    return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => {
            return [key, atom(val)];
        })
    );
};
export type IStoreData = ReturnType<typeof initGlobalData>;
export const initGlobalData = () => {
    /** 需要持久化的变量写这里 */
    const storageSetting = {
        tag_version: '2.1.3',
        showClassify: true,
        nonBreakLine: false,
        forceEN: false,
        emphasizeAddMode: false,
        emphasizeSubMode: false,
        emphasizeSymbol: '()',
        enMode: true,
        tagsPerPage: 500,
        r18Mode: false,
        deleteMode: false,
        showCount: true,
        username: '',
        searchNumberLimit: 1000,
        visibleId: 'ai-prompt' as PanelIds | '',
        webviewURL: '',
        MaxEmphasize: 10,
        defaultFont: false,
        /** @deprecated */
        iconBtn: false,
        showLangInLine1: false,
    };
    const context = ObjectToAtoms(storageSetting);
    const { recover, tracking } = useStorage(context);
    // 从 localstorage 恢复并开始统计数据
    recover();
    tracking();
    return context;
};
