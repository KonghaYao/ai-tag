import type { Component } from 'solid-js';
import type { Atom } from '@cn-ui/use';
import { TagsToString, breakSymbol } from '../../../../use/TagsConvertor';
import type { ITagData } from '../../../main/App';
import copy from 'copy-to-clipboard';
import { Notice } from '../../../../utils/notice';
import { useTranslation } from '../../../../i18n';
import { GlobalData } from '../../../../store/GlobalData';

export const Footer: Component<{
    userCollection: Atom<ITagData[]>;
    inputMode: Atom<boolean>;
}> = ({ userCollection, inputMode }) => {
    const { t } = useTranslation();
    const { emphasizeAddMode, deleteMode, changeTagMode } = GlobalData.getApp('data');
    return (
        <>
            <li
                class="cursor-pointer"
                classList={{
                    'rounded-md bg-slate-700': emphasizeAddMode(),
                }}
                title="添加模式，左键加权，右键减权"
                onClick={() => changeTagMode(emphasizeAddMode, true)}
            >
                🏷️
            </li>
            <li
                class="cursor-pointer"
                classList={{
                    'rounded-md bg-slate-700': deleteMode(),
                }}
                title="删除模式，点击删除"
                onClick={() => changeTagMode(deleteMode, true)}
            >
                ❌
            </li>
            <li
                class=" cursor-pointer text-sm"
                title="添加分割符号"
                onClick={() => {
                    userCollection((i) => [...i, { ...breakSymbol }]);
                    Notice.success(t('toolbar1.hint.addBreakLine'));
                }}
            >
                ➖
            </li>
            <li
                class="cursor-pointer"
                title="一键复制"
                onClick={() => (copy(TagsToString(userCollection())), Notice.success('复制成功'))}
            >
                📋
            </li>
            <li
                class="cursor-pointer"
                classList={{
                    'rounded-md bg-slate-700': inputMode(),
                }}
                title="输入框特写"
                onClick={() => inputMode((i) => !i)}
            >
                ✒️
            </li>
        </>
    );
};
