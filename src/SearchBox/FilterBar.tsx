import { createEffect, createMemo, createSelector, For, Show, useContext } from 'solid-js';
import { Data, IData } from '../App';
import { _emColor } from '../components/TagButton';
import { useTranslation } from '../../i18n';
import { sampleSize } from '../utils/sampleSize';
import { CSVToJSON } from '../utils/CSVToJSON';
import { atom, resource } from '@cn-ui/use';

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
    const show = atom(false);
    return (
        <div class="btn relative" onMouseEnter={() => show(true)} onclick={() => show((i) => !i)}>
            {selectType}
            <section
                class="blur-background absolute top-[150%] left-0 z-50 flex h-64 w-32 flex-col gap-2  overflow-scroll rounded-md p-2 text-slate-300 ring-1 ring-gray-500 transition-transform duration-300"
                classList={{
                    'scale-0': !show(),
                    'scale-100': show(),
                }}
                onMouseLeave={() => {
                    setTimeout(() => {
                        show(false);
                    }, 500);
                }}
            >
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
            </section>
        </div>
    );
};

export const FilterBar = () => {
    const { result, lists, tagsPerPage, searchNumberLimit } = useContext(Data);

    const { t } = useTranslation();
    return (
        <nav class="flex text-sm text-gray-400">
            <ClassFilter></ClassFilter>
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
