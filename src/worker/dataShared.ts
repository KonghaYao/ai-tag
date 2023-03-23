import { expose, ProxyMarked } from 'comlink';

const GlobalData = {
    prompt: '',
};
const listeners: (() => void)[] = [];
const api = {
    async changeData(newValue: Partial<typeof GlobalData>) {
        const needUpdate = Object.entries(newValue).some(([key, value]) => {
            if (GlobalData[key] !== value) {
                GlobalData[key] = value;
                return true;
            }
            return false;
        });
        if (needUpdate) listeners.forEach((i) => i());
        return GlobalData;
    },
    getData() {
        return GlobalData;
    },
    onUpdate(cb: (data: typeof GlobalData) => void) {
        listeners.push(() => cb(GlobalData));
    },
};
export type SharedDataAPI = typeof api;
if ('SharedWorkerGlobalScope' in self) {
    // 检测是否为 SharedWorker，因为移动端使用不了
    globalThis.onconnect = (event) => {
        const port = event.ports[0];
        expose(api, port);
    };
} else {
    console.log('普通 Worker 环境');
    expose(api);
}
