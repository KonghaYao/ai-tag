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
export const useDragAndDropData = <TransferData extends { type: string; data: any }>() => {
    /**
     *
     * @param eventTransfer 如果为 false，接收全局默认的数据
     */
    const receive = <T>(
        eventTransfer: DataTransfer | false,
        type: string,
        cb: (data: any, dataTransfer: DataTransfer | false) => T
    ): boolean => {
        type = type.toLowerCase();
        const transfer = eventTransfer || holding;

        for (const iterator of [...transfer.types]) {
            if (iterator === 'x-application/' + type) {
                const data = transfer.getData('x-application/' + type);

                try {
                    const Payload = JSON.parse(data) as TransferData;
                    cb(Payload.data, eventTransfer);
                    return true;
                } catch (e) {
                    console.warn(e);
                    return false;
                }
            }
        }

        return false;
    };
    return {
        send(transfer: DataTransfer, info: TransferData) {
            let type = 'x-application/' + info.type.toLowerCase();
            const string = JSON.stringify(info);
            transfer.setData(type, string);
            holding.setData(type, string);
        },
        receiveAll(
            eventTransfer: DataTransfer | false,
            obj: Record<string, (data: any, dataTransfer?: DataTransfer | false) => void>,
            multi = true
        ) {
            Object.entries(obj)[multi ? 'forEach' : 'some'](([key, value]) => {
                if (key === 'extra') {
                    return value(null, eventTransfer);
                } else {
                    return receive(eventTransfer, key, value);
                }
            });
        },

        receive,
        detect(
            eventTransfer: DataTransfer,
            obj: { [key: string]: (transfer: DataTransfer) => void }
        ) {
            // type 需要解构保持状态
            for (const transType of [...eventTransfer.types]) {
                if (transType.startsWith('x-application/')) {
                    obj[transType] && obj[transType](eventTransfer);
                    const key = transType.replace('x-application/', '').toUpperCase();
                    obj[key] && obj[key](eventTransfer);
                }
            }
            obj.extra && obj.extra(eventTransfer);
        },
    };
};
