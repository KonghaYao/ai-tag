import { atom, createIgnoreFirst } from '@cn-ui/use';
import localforage from 'localforage';
import { memoize } from 'lodash-es';
import { createEffect } from 'solid-js';

/** 单条魔咒的详细情况 */
export interface SingleMagic {
    id: string;
    title: string;
    tags: string;
    description: string;
    /** 示例照片的地址 */
    demos: string[];
    create_time: string;
    last_update: string;
}

const initDatabase = memoize(() => {
    const store = localforage.createInstance({
        name: 'magic_notebook',
        driver: [localforage.INDEXEDDB],
    });

    const IndexList = atom<string[]>([]);

    createIgnoreFirst(() => {
        store.setItem('MasterKey', IndexList());
    }, [IndexList]);

    store.getItem('MasterKey').then((res: string[] = []) => {
        return IndexList(res ?? []);
    });

    return { store, IndexList };
});

export const useIndexedDB = () => {
    const database = initDatabase();
    const addMagic = async (tags: string) => {
        const id = Math.ceil(Math.random() * 100000000).toString();
        const data: SingleMagic = {
            id,
            tags,
            title: id + ' 号魔咒',
            description: '',
            demos: [],
            create_time: new Date().toISOString(),
            last_update: new Date().toISOString(),
        };
        return database.store.setItem(id, data).then(() => database.IndexList((i) => [id, ...i]));
    };
    const DeleteMagic = async (id: string) => {
        return database.store.removeItem(id).then(() => {
            database.IndexList((i) => i.filter((ii) => ii !== id));
        });
    };
    const ChangeMagic = (newMagic: SingleMagic) => {
        return database.store.setItem(newMagic.id, {
            ...newMagic,
            last_update: new Date().toISOString(),
        });
    };
    return { ...database, addMagic, DeleteMagic, ChangeMagic };
};
