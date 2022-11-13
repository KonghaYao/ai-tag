import { throttle } from 'lodash-es';
export type HoverWay = 'Drag' | 'Over';

/** 检测用户在拖拽或者是鼠标浮过 */
export const useHoverInDOM = (cb: (way: HoverWay, e: Event) => void) => {
    const inner = throttle(cb, 300);
    return {
        events: {
            ondragover(e: Event) {
                e.stopPropagation();
                inner('Drag', e);
            },
            onmouseover(e: Event) {
                inner('Over', e);
            },
        },
    };
};
