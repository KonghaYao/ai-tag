import type { ITagData } from '../app/main/App';
import Fuse from 'fuse.js';
type IndexedData = ITagData & { id?: number };

class Search {
    static data: IndexedData[];
    static numberLimit = 1000;
    static query: Fuse<IndexedData>;
}

export const init = async (input: IndexedData[]) => {
    // 这里不需要处理，排序为 en 和 cn
    input.forEach((i, index) => (i.id = index));
    Search.data = input;
    return true;
};
export const add = async (input: IndexedData[]) => {
    console.log('更新数据 ', input.length);
    Search.data.push(...input);
    Search.data.sort((a, b) => b.count - a.count);
    Search.data.forEach((i, index) => (i.id = index));
    return true;
};

const createQuery = (data: ITagData[]) => {
    Search.query = new Fuse(data, {
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
    const querySet = Search.data.filter((i) => (r18 || !i.r18) && i.count >= numberLimit);
    createQuery(querySet);
    return true;
};
export const search = ({ text, limit }) => {
    console.log('搜索 ', text, limit);

    return Search.query
        .search(text)
        .map((i) => i.item.id)
        .slice(0, limit);
};
