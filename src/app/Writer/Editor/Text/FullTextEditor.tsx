import type { Component } from 'solid-js';
import { ContentEditable } from '../../../../components/ContentEditable';
import type { Atom } from '@cn-ui/use';

export const FullTextEditor: Component<{
    text: Atom<string>;
    placeholder?: string;
    onConfirmEnter?: () => void;
}> = (props) => {
    return (
        <ContentEditable
            placeholder={props.placeholder}
            value={props.text}
            // 避免立即删除
            onKeyDown={(e: any) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    props.onConfirmEnter && props.onConfirmEnter();
                }
            }}
        ></ContentEditable>
    );
};
