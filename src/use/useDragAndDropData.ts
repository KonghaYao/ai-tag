import { SingleMagic } from '../../notebook/use/useIndexedDB';
import { IData } from '../App';

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

/**
 * ! HTML5 中的 DataTransfer 会全局变化，所以 dragover 收集不到信息
 */
let holding = {
    info: '',
    getData(type: string) {
        return this.info;
    },
    setData(type: string, data: string) {
        this.info = data;
    },
    types: [],
} as any as DataTransfer;
export const useDragAndDropData = () => {
    return {
        send(transfer: DataTransfer, info: TagTransfer) {
            let type = 'x-application/' + info.type.toLowerCase();
            const string = JSON.stringify(info);
            transfer.setData(type, string);
            holding.setData(type, string);
        },
        /**
         *
         * @param eventTransfer 如果为 false，接收全局默认的数据
         */
        receive<T>(
            eventTransfer: DataTransfer | false,
            type: string,
            cb: (data: any) => T
        ): T | undefined {
            type = type.toLowerCase();
            const transfer = eventTransfer || holding;

            for (const iterator of [...transfer.types]) {
                if (iterator === 'x-application/' + type) {
                    const data = transfer.getData('x-application/' + type);

                    try {
                        const Payload = JSON.parse(data) as TagTransfer;
                        return cb(Payload.data);
                    } catch (e) {
                        console.warn(e);
                        return;
                    }
                }
            }

            return;
        },
        detect(eventTransfer: DataTransfer, obj: { [key: string]: Function }) {
            for (const iterator of [...eventTransfer.types]) {
                if (iterator.startsWith('x-application/')) {
                    const key = iterator.replace('x-application/', '').toUpperCase();
                    obj[key] && obj[key]();
                    obj[iterator] && obj[iterator]();
                }
            }
        },
    };
};
