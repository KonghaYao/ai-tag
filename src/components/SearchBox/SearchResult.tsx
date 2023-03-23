import { createEffect, For, on, useContext } from 'solid-js';
import { TagButton } from '../TagButton';
import { reflect } from '@cn-ui/use';
import { untrack } from 'solid-js/web';
import { CreateIData } from '../../use/TagsConvertor';
import { useTranslation } from '../../i18n';
import { DragPoster } from '@cn-ui/headless';
import { GlobalData } from '../../store/GlobalData';

export const SearchResult = () => {
    const { tagsPerPage } = GlobalData.getApp('data');
    const { usersCollection, result } = GlobalData.getApp('tag-control');
    const showingResult = reflect(() => {
        const num = untrack(tagsPerPage);
        return result().slice(0, num);
    });

    // fixed 修复搜索完成之后没回去的问题
    let searchResult!: HTMLDivElement;
    createEffect(on(showingResult, () => searchResult.scrollTo(0, 0)));

    const { t } = useTranslation();
    return (
        <section
            class="search-results flex h-full flex-wrap content-start  overflow-y-auto overflow-x-hidden  pb-4"
            ref={searchResult}
        >
            <For each={showingResult()} fallback={() => <div>{t('hint.LoadingData')}</div>}>
                {(item) => (
                    <DragPoster send={(send) => send('ADD_BEFORE', item.en)}>
                        <TagButton
                            data={item}
                            onClick={(item) => usersCollection((i) => [...i, CreateIData(item)])}
                        ></TagButton>
                    </DragPoster>
                )}
            </For>
        </section>
    );
};
