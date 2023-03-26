import type { Component } from 'solid-js';
import { _emColor } from '../TagButton';
import { useTranslation } from '../../i18n';
import { sampleSize } from '../../utils/sampleSize';
import type { Atom } from '@cn-ui/use';
import { GlobalData } from '../../store/GlobalData';
export const FilterBar: Component<{
    classifyType: Atom<string>;
}> = (props) => {
    const { showClassify } = GlobalData.getApp('data')!;
    const { t } = useTranslation();
    return (
        <nav class="flex flex-col justify-between text-sm text-gray-400 sm:flex-row">
            <span class="flex flex-none gap-1">
                <div
                    class="flex cursor-pointer items-center rounded-md bg-slate-700 px-1"
                    onclick={() => showClassify((i) => !i)}
                >
                    <span>{props.classifyType()}</span>
                    <span class="font-icon ">{!showClassify() ? '>' : '<'}</span>
                </div>
                <div>{t('searchBox.searchResult')}</div>
            </span>
        </nav>
    );
};
