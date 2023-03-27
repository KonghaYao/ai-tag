import { atom } from '@cn-ui/use';
import localforage from 'localforage';
import { memoize } from 'lodash-es';
import md5 from 'md5';

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

    const images = localforage.createInstance({
        name: 'magic_images',
        driver: [localforage.INDEXEDDB],
    });

    const IndexList = atom<string[]>([]);
    store.keys().then((res) => {
        IndexList(res ?? []);
    });

    return { store, IndexList, images };
});

export const useIndexedDB = () => {
    const database = initDatabase();

    // const searchMagic = (text:string)=>{
    //     return database.IndexList.
    // }

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

    return {
        ...database,
        addMagic,
        DeleteMagic,
        ChangeMagic,
        async AddDemoImage(file: File, oldMagic: SingleMagic) {
            const buffer = await file.arrayBuffer();
            const id = md5(new Uint8Array(buffer));
            if (oldMagic.demos.includes(id)) return;
            await database.images.setItem(id, file);
            return ChangeMagic({ ...oldMagic, demos: [...oldMagic.demos, id] });
        },
        getImage: memoize(async (id: string) => {
            return database.images.getItem<File>(id).then((res) => {
                return URL.createObjectURL(res!);
            });
        }) as (id: string) => Promise<string>,
        DeleteImage: async (oldMagic: SingleMagic, id: string) => {
            oldMagic.demos = oldMagic.demos.filter((i) => i !== id);
            await database.images.removeItem(id);
            return ChangeMagic(oldMagic);
        },

        async ExportText() {
            const data = await IndexedBackup.backup(database.store);
            return new Blob([JSON.stringify(data)]);
        },
        async ImportText(blob: Blob) {
            const data = await blob.text();
            const it = JSON.parse(data);
            await IndexedBackup.recover(database.store, it);
        },
        async ImportImage(blob: Blob) {
            const { default: JSZip } = await import(
                /*** @ts-ignore */
                /* @vite-ignore*/ 'https://esm.sh/jszip@3.10.1'
            );
            const zip = new JSZip();
            return zip.loadAsync(blob).then(async () => {
                console.log(zip.files);
                for (const name in zip.files) {
                    const blob = await zip.file(name).async('blob');
                    database.images.setItem(name.split('.')[0], new File([blob], name));
                }
            });
        },
        async ExportImage(sliceReady: (blob: Blob, index: number) => Promise<void>) {
            const { default: JSZip } = await import(
                /*** @ts-ignore */
                /* @vite-ignore*/ 'https://esm.sh/jszip@3.10.1'
            );
            console.log('JSZip 加载完成');

            let zip = new JSZip();
            let sizeCounter = 0;
            let index = 0;
            const keys = await database.images.keys();
            for (const key of keys) {
                const file = await database.images.getItem<File>(key);
                if (!file) throw new Error('访问图片错误 ' + key);
                sizeCounter += file.size;
                zip.file(file.name.replace(/(.*)(?=\.\w+$)/, key), file);
                if (sizeCounter >= 1 * 1024 * 1024) {
                    sizeCounter = 0;
                    const blob = await zip.generateAsync({ type: 'blob' });
                    zip = new JSZip();
                    await sliceReady(blob, index);
                }
                index++;
            }
        },
    };
};

const IndexedBackup = {
    async backup<T>(store: LocalForage) {
        const collection: [string, T][] = [];
        await store.iterate((value, key) => {
            collection.push([key, value as T]);
        });
        return collection;
    },
    async recover<T>(store: LocalForage, backup: [string, T][]) {
        for (const [key, value] of backup) {
            await store.setItem(key, value);
        }
    },
};
