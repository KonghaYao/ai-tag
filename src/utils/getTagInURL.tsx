import { useSearchParams } from '@solidjs/router';
import { IData } from '../App';
import { stringToTags } from '../use/TagsConvertor';

export const getTagInURL = (lists: IData[]) => {
    const [{ tags }] = useSearchParams();
    if (!tags) return [];
    try {
        return stringToTags(tags, lists) ?? [];
    } catch (e) {
        console.warn(e);
        return [];
    }
};
