import { Component, mergeProps } from 'solid-js';
import { InputArea } from './InputArea';
import { CommentList } from './CommentList';
import { TalkConfig, TalkContext } from './TalkContext';
import { atom } from '@cn-ui/use';
export const TalkDefault: Component<TalkConfig> = (props) => {
    const input = {
        VERSION: '1.0.0',
        url: '/',
        DatabaseName: 'Comment',
        ...props,
    } as Required<TalkConfig>;
    const atSomeone = atom(null);
    let ref: HTMLDivElement;

    return (
        <TalkContext.Provider
            value={{
                ...input,
                atSomeone,
                backToTop() {
                    ref.scrollIntoView();
                },
                refreshPage: atom(() => {}),
            }}
        >
            <section class="flex flex-col border-slate-500" ref={ref}>
                <InputArea></InputArea>
                <CommentList></CommentList>
            </section>
        </TalkContext.Provider>
    );
};
