import { createEffect, For, on, useContext } from 'solid-js';
import { TagButton } from '../TagButton';
import { atom, reflect, resource } from '@cn-ui/use';
import { CreateIData } from '../../use/TagsConvertor';
import { useTranslation } from '../../i18n';
import { DragPoster } from '@cn-ui/headless';
import { GlobalData } from '../../store/GlobalData';
import { AC } from '../AC';
import type { ITagData } from '../../app/main/App';

export const SearchResult = () => {
    const { usersCollection, searchText } = GlobalData.getApp('tag-control');

    const result = resource(
        () =>
            fetch('https://able-hare-95.deno.dev/tags', {
                method: 'POST',
                body: JSON.stringify({ text: searchText() }),
            })
                .then((res) => res.json())
                .then((res) => {
                    return res.hits as ITagData[];
                }),
        { initValue: [], deps: [searchText] }
    );

    // fixed 修复搜索完成之后没回去的问题
    let searchResult!: HTMLDivElement;
    createEffect(
        on(result, (data) => {
            searchResult.scrollTo(0, 0);
        })
    );

    const { t } = useTranslation();
    result();
    return (
        <section
            class="search-results flex h-full flex-wrap content-start  overflow-y-auto overflow-x-hidden  pb-4"
            ref={searchResult}
        >
            <AC resource={result} loading={() => <div>{t('hint.LoadingData')}</div>}>
                <For each={result()} fallback={() => <div>数据为空</div>}>
                    {(item) => (
                        <DragPoster send={(send) => send('ADD_BEFORE', item.en)}>
                            <TagButton
                                data={item}
                                onClick={(item) =>
                                    usersCollection((i) => [...i, CreateIData(item)])
                                }
                            ></TagButton>
                        </DragPoster>
                    )}
                </For>
            </AC>
        </section>
    );
};
