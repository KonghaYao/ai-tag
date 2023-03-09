import { Atom, atom, atomization } from '@cn-ui/use';
import { throttle } from 'lodash-es';
import { onCleanup } from 'solid-js';

export function useMouse({
    type = 'page',
    initialValue = { x: 0, y: 0 },
    disabled,
}: {
    /**
     * Mouse position based by page, client, or relative to previous position
     *
     * @default 'page'
     */
    type?: 'page' | 'client' | 'movement';
    disabled?: Atom<boolean>;
    /**
     * Initial values
     */
    initialValue?: { x: number; y: number };
} = {}) {
    const x = atom(initialValue.x);
    const y = atom(initialValue.y);
    const _disabled = atomization(disabled);
    const mouseHandler = throttle((event: MouseEvent) => {
        if (type === 'page') {
            x(event.pageX);
            y(event.pageY);
        } else if (type === 'client') {
            x(event.clientX);
            y(event.clientY);
        } else if (type === 'movement') {
            x(event.movementX);
            y(event.movementY);
        }
    }, 16);

    const mouseHandlerWrapper = (event: MouseEvent) => {
        if (_disabled() === true) return;
        return mouseHandler(event);
    };

    if (window) {
        window.addEventListener('mousemove', mouseHandlerWrapper);
        window.addEventListener('dragover', mouseHandlerWrapper);
        onCleanup(() => {
            window.removeEventListener('mousemove', mouseHandlerWrapper);
            window.removeEventListener('dragover', mouseHandlerWrapper);
        });
    }

    return {
        x,
        y,
    };
}
