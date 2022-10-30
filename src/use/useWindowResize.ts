import { atom } from '@cn-ui/use';
import { debounce } from 'lodash-es';
import { createEffect } from 'solid-js';

export const useWindowResize = () => {
    const width = atom(document.body.clientWidth);
    const getWidth = debounce(() => {
        width(document.body.clientWidth);
    }, 300);
    window.addEventListener('resize', getWidth);
    window.addEventListener('onload', getWidth);

    return { width };
};
