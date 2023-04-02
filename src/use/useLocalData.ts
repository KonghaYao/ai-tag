import { Atom, atom } from '@cn-ui/use';
import localforage from 'localforage';
import { createEffect } from 'solid-js';
/** 同步 atom 和 Storage 的数据 */
const dataSync = <T>(info: Atom<T>, key: string, Store: typeof localforage) => {
    // const info = atom<T>(init);
    Promise.resolve(Store.getItem(key)).then((val: any) => {
        if (val) info(() => val);
    });
    createEffect(() => {
        console.log('写入 IndexDB ', key);
        Store.setItem(key, info());
    });
    return info;
};
const Store = localforage.createInstance({
    name: 'user-data',
});

/** 加载 IndexedDB 中的数据并进行同步 */
export const useLocalData = () => {
    return {
        backgroundImage: dataSync<string>(atom(''), 'background-image', Store),
    };
};
