import type { ITagData } from '../app/main/App';
import { stringToTags } from '../use/TagsConvertor';

/**
 * 获取 URL 中的 Tag 参数
 * @deprecated 没有用到
 */
export const getTagInURL = (lists: ITagData[]) => {
    const tags = new URLSearchParams(location.search).get('tags');
    if (!tags) return [];
    try {
        return stringToTags(tags, lists) ?? [];
    } catch (e) {
        console.warn(e);
        return [];
    }
};
