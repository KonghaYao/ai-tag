import { createBlackBoard } from '@cn-ui/use';
import type { IStoreData } from './index';
import type { ISideAPPStore } from './SideAppStore';
import type { ITagStore } from './useGlobalTags';
import type { ITalkStore } from '../Panels/Talk/TalkStore';
import type { IGalleryStore } from './GalleryStore';

/** 这是一个基于黑板机制的 Context，用于跨组件进行数据交换 */
export const GlobalData = createBlackBoard<{
    data: IStoreData;
    'side-app': ISideAPPStore;
    'tag-control': ITagStore;
    talk: ITalkStore;
    gallery: IGalleryStore;
}>();

/** 导出到 Global 的语法糖 */
export const ExposeToGlobal = <T extends (...args: any) => any>(key: string, init: T): T => {
    /** @ts-ignore ignore: 懒得弄了，反正是对的 */
    return (...args: any) => {
        const context = init(...args);
        GlobalData.register(key as any, context as any);
        return context;
    };
};
