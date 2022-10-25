import { useSearchParams } from '@solidjs/router';
import { IData } from '../App';
import { stringToTags } from '../use/TagsToString';

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
