import { IData } from '../App';
import Fuse from 'fuse.js';
type IndexedData = IData & { id?: number };
export let query: Fuse<IndexedData>;
let data: IndexedData[];
export const init = async (input: IndexedData[]) => {
    // 这里不需要处理，排序为 en 和 cn
    input.forEach((i, index) => (i.id = index));
    data = input;
    return true;
};
const createQuery = (data: IData[]) => {
    query = new Fuse(data, {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,

        // includeMatches: true,// 匹配到哪些地方
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        threshold: 1,
        distance: 100,
        useExtendedSearch: true,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: ['cn', 'en'],
    });
};
export const rebuild = async ({ r18, numberLimit }) => {
    const querySet = data.filter((i) => (r18 || !i.r18) && i.count >= numberLimit);
    createQuery(querySet);
    return true;
};
export const search = ({ text, limit }) => {
    console.log('搜索 ', text, limit);
    return query
        .search(text)
        .map((i) => i.item.id)
        .slice(0, limit);
};
