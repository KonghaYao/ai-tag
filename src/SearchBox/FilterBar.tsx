import { createMemo, useContext } from 'solid-js';
import { Data } from '../App';
import { _emColor } from '../components/TagButton';
import { useTranslation } from '../../i18n';
import { sampleSize } from '../utils/sampleSize';
import { ClassFilter } from './ClassFilter';
export const FilterBar = () => {
    const { result, lists, tagsPerPage, searchNumberLimit, showClassify } = useContext(Data);

    const { t } = useTranslation();
    return (
        <nav class="flex flex-col justify-between text-sm text-gray-400 sm:flex-row">
            <span class="flex flex-none gap-1">
                <div
                    class="font-icon  rounded-md px-1 hover:bg-slate-700"
                    onclick={() => showClassify((i) => !i)}
                >
                    {!showClassify() ? 'navigate_next' : 'navigate_before'}
                </div>
                {t('searchBox.searchResult')} {result().length} /
                {lists() ? lists().length : t('loading')}
            </span>

            <div class="flex gap-1">
                <ClassFilter></ClassFilter>
                <div
                    class={
                        'btn flex-none  text-slate-200 ' +
                        _emColor[searchNumberLimit().toString().length - 1]
                    }
                    onclick={() => {
                        searchNumberLimit((i) => {
                            if (i === 0) return 10;
                            if (i === 1000000) return 0;
                            return i * 10;
                        });
                    }}
                >
                    {searchNumberLimit() === 0
                        ? t('searchBox.NoNumberFilter')
                        : `> ${searchNumberLimit().toLocaleString('en')}`}
                </div>
                <span
                    class="btn flex-none bg-cyan-700 text-slate-200 "
                    onclick={() => {
                        result(sampleSize(lists(), tagsPerPage()));
                    }}
                >
                    {t('searchBox.Random')} {tagsPerPage()}
                </span>
            </div>
        </nav>
    );
};
