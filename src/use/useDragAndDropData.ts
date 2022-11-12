export type TagTransfer =
    // 添加魔咒到指定地点
    {
        type: 'ADD_BEFORE';
        data: string;
    };
export const useDragAndDropData = () => {
    return {
        send(transfer: DataTransfer, info: TagTransfer) {
            transfer.setData('application/json', JSON.stringify(info));
        },
        receive<T>(transfer: DataTransfer, type: string, cb: (data: any) => T): T | undefined {
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
