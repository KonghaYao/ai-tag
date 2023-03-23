import { Atom, atom, usePagination } from '@cn-ui/use';
import { batch } from 'solid-js';

/** 逐页查询组件，但是是滑动加载的那种，不会清除上次数据
 * @test
 */
export const usePaginationStack = <T>(
    getData: (pageNumber: number, maxPage: Atom<number>) => Promise<T>,
    init: {
        initIndex?: number;
        immediatelyRequest?: boolean;
    } = {}
) => {
    const dataSlices = atom<T[]>([], { equals: false });
    const p = usePagination(async (...args) => {
        const data = await getData(...args);
        dataSlices((i) => {
            i[args[0]] = data;
            return i;
        });
        return data;
    }, init);
    return {
        ...p,
        /** 重置搜索*/
        resetStack() {
            batch(() => {
                dataSlices([]);
                p.currentIndex(0);
                p.currentData.refetch();
            });
        },
        /** 这个才是需要渲染的最终数据 */
        dataSlices,
    };
};
