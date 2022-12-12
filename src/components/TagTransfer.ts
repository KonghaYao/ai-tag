import { SingleMagic } from '../../notebook/use/useIndexedDB';
import { IData } from '../App';

/** 整个APP中的传输信息 */

export type TagTransfer =
    // 添加魔咒到指定地点
    | {
          type: 'ADD_BEFORE' | 'PURE_TAGS' | 'INPUT_MAGIC' | 'COMBINE_MAGIC';
          data: string;
      }
    | {
          type: 'USER_SELECTED';
          data: IData;
      }
    | {
          type: 'MAGIC_IMAGE';
          data: {
              origin: SingleMagic;
              position: string;
          };
      };
