import { atom } from '@cn-ui/use';
import localforage from 'localforage';
import { createEffect } from 'solid-js';

const dataSync = <T>(Store: typeof localforage, key: string, init: T) => {
    const info = atom<T>(init);
    Store.getItem(key).then((str: any) => {
        info(str);
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
export const useLocalData = () => {
    return {
        backgroundImage: dataSync(Store, 'background-image', ''),
    };
};
