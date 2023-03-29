import type { Component } from 'solid-js';
import type { BaseBlock } from '../../interface';
import { GlobalData } from '../../../../store/GlobalData';
import { Transformers } from '../Common/Transformers';
import { AISupport } from '../Common/AISupport';
import type { Atom, atom } from '@cn-ui/use';
import type { GlobalGPT } from '../../../../api/prompt-gpt';

export const SideBar: Component<{ block: BaseBlock; model: Atom<keyof typeof GlobalGPT> }> = (
    props
) => {
    const { emphasizeAddMode, deleteMode, changeTagMode } = GlobalData.getApp('data');
    return (
        <>
            <li
                class="cursor-pointer"
                classList={{
                    'rounded-md bg-slate-600': emphasizeAddMode(),
                }}
                title="添加模式，左键加权，右键减权"
                onClick={() => changeTagMode(emphasizeAddMode, true)}
            >
                🏷️
            </li>
            <li
                class="cursor-pointer"
                classList={{
                    'rounded-md bg-slate-600': deleteMode(),
                }}
                title="删除模式，点击删除"
                onClick={() => changeTagMode(deleteMode, true)}
            >
                ❌
            </li>
            <AISupport model={props.model} block={props.block}></AISupport>
            <Transformers block={props.block}></Transformers>
        </>
    );
};
