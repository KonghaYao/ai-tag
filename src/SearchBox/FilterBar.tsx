import { useContext } from 'solid-js';
import { Data } from '../App';
import { _emColor } from '../components/TagButton';
import { useTranslation } from '../../i18n';
import { sampleSize } from '../utils/sampleSize';

export const FilterBar = () => {
    const { result, lists, tagsPerPage, searchNumberLimit } = useContext(Data);

    const { t } = useTranslation();
    return (
        <nav class="flex text-sm text-gray-400">
            <span class="flex-none">
                {t('searchBox.searchResult')} {result().length} /
                {lists() ? lists().length : t('loading')}
            </span>

            <span class="flex-1"></span>
            <div
                class={'btn flex-none ' + _emColor[searchNumberLimit().toString().length - 1]}
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
                class="btn flex-none bg-cyan-700"
                onclick={() => {
                    result(sampleSize(lists(), tagsPerPage()));
                }}
            >
                {t('searchBox.Random')} {tagsPerPage()}
            </span>
        </nav>
    );
};
