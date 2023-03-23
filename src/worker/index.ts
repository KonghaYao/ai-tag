import type { ITagData } from '../app/main/App';
import { proxy, wrap } from 'comlink';
import type { SharedDataAPI } from './dataShared';
/** Vite 识别不了动态的 Worker 创建。。。 */

// 主线程的激活函数
export const initWorker = () => {
    // ! vite 在处理动态的 Worker Option 中有 BUG，导致 /* @vite-ignore  */ 无法生效，故在插件中 打包模式下直接删除了 Option

    // 初始化搜索 worker
    const searchWorker = wrap<{
        init: (input: ITagData[]) => Promise<void>;
        add: (input: ITagData[]) => Promise<void>;
        rebuild: (a: { r18: boolean; numberLimit: number }) => Promise<true>;
        search: (a: { text: string; limit: number }) => Promise<number[]>;
    }>(
        'SharedWorker' in globalThis
            ? new SharedWorker(new URL('../worker/searchWorker', import.meta.url), {
                  type: 'module',
              }).port
            : new Worker(new URL('../worker/searchWorker', import.meta.url), {
                  type: 'module',
              })
    );
    console.log(import.meta.url);
    const sharedWorker = wrap<SharedDataAPI>(
        'SharedWorker' in globalThis
            ? new SharedWorker(new URL('../worker/dataShared', import.meta.url), {
                  type: 'module',
              }).port
            : new Worker(new URL('../worker/dataShared', import.meta.url), {
                  type: 'module',
              })
    );
    console.log('Worker 线程创建完成');
    return { searchWorker, sharedWorker };
};
