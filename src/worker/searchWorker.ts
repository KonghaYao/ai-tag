import { expose } from 'comlink';
import * as api from './searchCore';
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
