import { createBlackBoard } from '@cn-ui/use';
import type { IStoreData } from './index';
import type { ISideAPPStore } from './SideAppStore';
import type { ITagStore } from './useGlobalTags';

/** 这是一个基于黑板机制的 Context，用于跨组件进行数据交换 */
export const GlobalData =
    createBlackBoard<{ data: IStoreData; 'side-app': ISideAPPStore; 'tag-control': ITagStore }>();
