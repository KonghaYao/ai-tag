import { createEffect, createMemo, createSelector, For, Show, useContext } from 'solid-js';
import { Data, IData } from '../App';
import { _emColor } from '../components/TagButton';
import { useTranslation } from '../../i18n';
import { sampleSize } from '../utils/sampleSize';
import { CSVToJSON } from '../utils/CSVToJSON';
import { atom, resource } from '@cn-ui/use';
import { FloatPanel } from '../components/FloatPanel';

const ClassFilter = () => {
    const { result, lists } = useContext(Data);
    const FilterClass = new Set(['全部']);
    const data = resource(async () => {
        const binary = await fetch('./tagClassify.csv').then((res) => res.blob());
        const data = await CSVToJSON<{ en: string; cn: string; type: string }>(binary);

        return data.map((i) => {
            FilterClass.add(i.type);
            return { ...i, r18: 0, count: Infinity, text: i.en, emphasize: 0 } as IData & {
                type: string;
            };
        });
    });
    const selectType = atom('全部');
    const isSelect = createSelector(selectType);
    createEffect(() => {
        if (FilterClass.has(selectType()) && data.isReady()) {
            if (selectType() === '全部') {
                result(lists().slice(0, 500));
            } else {
                const showing = data().filter((i) => i.type === selectType());
                result(showing);
            }
        }
    });
    return (
        <FloatPanel
            popup={
                <div class=" flex h-64  w-32 flex-col gap-2 ">
                    <Show when={data.isReady()}>
                        <For each={[...FilterClass.values()]}>
                            {(item) => {
                                return (
                                    <div
                                        class="btn"
                                        classList={{
                                            'bg-green-600': isSelect(item),
                                        }}
                                        onclick={() => {
                                            selectType(item);
                                        }}
                                    >
                                        {item}
                                    </div>
                                );
                            }}
                        </For>
                    </Show>
                </div>
            }
        >
            <div class="btn relative bg-pink-700 text-neutral-300">{selectType}</div>
        </FloatPanel>
    );
};

export const FilterBar = () => {
    const { result, lists, tagsPerPage, searchNumberLimit } = useContext(Data);

    const { t } = useTranslation();
    return (
        <nav class="flex flex-col justify-between text-sm text-gray-400 sm:flex-row">
            <span class="flex-none">
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
