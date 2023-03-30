import type { Component, For, useContext } from 'solid-js';
import type { BaseBlock } from '../../interface';
import { GlobalData } from '../../../../store/GlobalData';
import { Transformers } from '../Common/Transformers';
import { AISupport } from '../Common/AISupport';
import type { Atom, atom } from '@cn-ui/use';
import type { GlobalGPT } from '../../../../api/prompt-gpt';
import { WriterContext } from '../../WriterContext';

export const SideBar: Component<{ block: BaseBlock; model: Atom<keyof typeof GlobalGPT> }> = (
    props
) => {
    return (
        <>
            <AISupport model={props.model} block={props.block}></AISupport>
            <Transformers block={props.block}></Transformers>
        </>
    );
};
