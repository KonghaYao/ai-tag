import { atom } from '@cn-ui/use';
import { children, JSXElement } from 'solid-js';
import { useDragAndDropData } from '../use/useDragAndDropData';
export function DragPoster<T>(props: {
    children: JSXElement;
    send?: (sendFunction: (type: string, data: any) => void, dataTransfer: DataTransfer) => T;
    text?: string | (() => string);
}) {
    const child = children(() => props.children)() as any as HTMLDivElement;
    const { send } = useDragAndDropData();
    child.addEventListener('dragstart', (e) => {
        props.text &&
            e.dataTransfer.setData(
                'text',
                typeof props.text === 'string' ? props.text : props.text()
            );
        const wait = (type: string, data: unknown) => {
            send(e.dataTransfer, {
                type,
                data,
            });
        };
        props.send(wait, e.dataTransfer);
    });
    child.draggable = true;
    return child;
}

export const DropReceiver = (props: {
    detect?: Parameters<ReturnType<typeof useDragAndDropData>['detect']>[1];
    receive?: Parameters<ReturnType<typeof useDragAndDropData>['receiveAll']>[1];
    children: JSXElement;
    multi?: boolean;
}) => {
    const child = children(() => props.children)() as any as HTMLDivElement;
    const { detect, receiveAll } = useDragAndDropData();

    const ondragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.detect && detect(e.dataTransfer, props.detect);
    };
    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 默认添加到末尾
        props.receive && receiveAll(e.dataTransfer, props.receive, props.multi ?? true);
    };
    child.addEventListener('dragover', ondragover);
    child.addEventListener('drop', onDrop);
    return child;
};
