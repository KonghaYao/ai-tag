import { useSearchParams } from '@solidjs/router';
import { IData } from '../App';

export const getTagInURL = (lists: IData[]) => {
    const [{ tags }] = useSearchParams();
    if (!tags) return [];
    try {
        return (
            tags.split(',').map((i) => {
                return (
                    lists.find((item) => item.en === i) ??
                    ({ en: i, cn: i, r18: 0, count: Infinity } as IData)
                );
            }) ?? []
        );
    } catch (e) {
        console.warn(e);
        return [];
    }
};
