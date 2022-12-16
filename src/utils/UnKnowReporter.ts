import { ResourceAtom, Atom } from '@cn-ui/use';
import { IData } from '../App';
export const initUnknownReporter = async () => {
    await import(
        /** @vite-ignore */
        /**@ts-ignore */
        'https://unpkg.com/leancloud-storage/dist/av-min.js'
    );

    await globalThis.AV.init({
        appId: 'mnyUPAL9vkRPOc9skLlWxupw-gzGzoHsz',
        appKey: 'SanjNh0jdz4fP1dS0Bc1Inrf',
        serverURL: 'https://mnyupal9.lc-cn-n1-shared.com',
    });
};

let totalUpload: string[] = (localStorage.getItem('__unknown_tags_uploaded__') || '').split('😍');
export const addUnknowns = (adds: string[]) => {
    let tags: string[] = JSON.parse(localStorage.getItem('__unknown_tags_cache__') ?? '[]');
    tags.push(...adds);
    tags = [...new Set(tags.filter((i) => !totalUpload.includes(i)))];
    if (tags.length >= 5) {
        console.warn('上报', tags);
        RecordToServer(tags);
        totalUpload.push(...tags);
        localStorage.setItem('__unknown_tags_uploaded__', totalUpload.join('😍'));
        localStorage.setItem('__unknown_tags_cache__', '[]');
    } else {
        localStorage.setItem('__unknown_tags_cache__', JSON.stringify(tags));
    }
};

export const addUnknownReporter = (
    lists: ResourceAtom<IData[]>,
    usersCollection: Atom<IData[]>
) => {
    setInterval(() => {
        if (lists.isReady() && lists().length) {
            const data = usersCollection()
                .filter((i) => i.count === Infinity)
                .filter((it) => {
                    return !lists().some((i) => i.en === it.en);
                })
                .map((i) => i.en);
            addUnknowns(data);
        }
    }, 3000);
};
export const RecordToServer = async (tags: string[]) => {
    return globalThis.AV.Object.saveAll(
        tags.map((i) => {
            const Record = globalThis.AV.Object.extend('tags');
            const todo = new Record();
            todo.set('tag', i);
            return todo;
        })
    ).then(
        function (savedObjects) {},
        function (error) {
            console.log(error);
        }
    );
};
