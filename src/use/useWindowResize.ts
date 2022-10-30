import { atom } from '@cn-ui/use';
import { debounce } from 'lodash-es';
import { createEffect } from 'solid-js';

export const useWindowResize = () => {
    const width = atom(0);
    window.addEventListener(
        'resize',
        debounce(() => {
            width(document.body.clientWidth);
        }, 300)
    );
    createEffect(() => {
        console.log(width());
    });

    return { width };
};
