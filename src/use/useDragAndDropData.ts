import { IData } from '../App';

export type TagTransfer =
    // 添加魔咒到指定地点
    | {
          type: 'ADD_BEFORE';
          data: string;
      }
    | {
          type: 'USER_SELECTED';
          data: IData;
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
} as any as DataTransfer;
export const useDragAndDropData = () => {
    return {
        send(transfer: DataTransfer, info: TagTransfer) {
            const string = JSON.stringify(info);
            transfer.setData('application/json', string);
            holding.setData('application/json', string);
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
            const transfer = eventTransfer || holding;
            const data = transfer.getData('application/json');

            if (data) {
                try {
                    const Payload = JSON.parse(data) as TagTransfer;
                    if (Payload.type === type) return cb(Payload.data);
                } catch (e) {
                    console.warn(e);
                    return;
                }
            }
            return;
        },
    };
};
