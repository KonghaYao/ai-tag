import type { Component } from 'solid-js';
import type { BaseBlock } from '../../interface';
import { GlobalData } from '../../../../store/GlobalData';
import { Transformers } from '../Common/Transformers';

export const SideBar: Component<{ block: BaseBlock }> = (props) => {
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

            <Transformers block={props.block}></Transformers>
        </>
    );
};
