import { expose, ProxyMarked } from 'comlink';

const GlobalData = {
    prompt: '',
};
const listeners = [];
const api = {
    async changeData(newValue: Partial<typeof GlobalData>) {
        Object.entries(newValue).forEach(([key, value]) => {
            GlobalData[key] = value;
        });
        listeners.forEach((i) => i());
        return true;
    },
    getData() {
        return GlobalData;
    },
    onUpdate(cb: (data: typeof GlobalData) => void) {
        listeners.push(() => cb(GlobalData));
    },
};
export type SharedDataAPI = typeof api;
globalThis.onconnect = (event) => {
    const port = event.ports[0];
    expose(api, port);
};
