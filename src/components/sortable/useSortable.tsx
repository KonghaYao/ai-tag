import { onCleanup } from 'solid-js';
import SortableCore from 'sortablejs';

/** 非响应式的，但是完全控制的 Sortable js 组件 */

export const useSortable = (options: SortableCore.Options) => {
    let sortable: SortableCore;

    onCleanup(() => {
        sortable && sortable.destroy();
    });
    return {
        initSort(ref: HTMLElement) {
            sortable = new SortableCore(ref, options);
        },
        getSortable() {
            return sortable;
        },
    };
};
