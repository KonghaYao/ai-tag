import type { IData } from '../app/main/App';
import { stringToTags } from '../use/TagsConvertor';

/** 获取 URL 中的 Tag 参数 */
export const getTagInURL = (lists: IData[]) => {
    const tags = new URLSearchParams(location.search).get('tags');
    if (!tags) return [];
    try {
        return stringToTags(tags, lists) ?? [];
    } catch (e) {
        console.warn(e);
        return [];
    }
};
