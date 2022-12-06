import { createEffect, For, on, useContext } from 'solid-js';
import { Data } from '../App';
import { TagButton } from '../components/TagButton';
import { reflect } from '@cn-ui/use';
import { untrack } from 'solid-js/web';
import { CreateIData } from '../use/TagsConvertor';
import { useTranslation } from '../../i18n';
import { useDragAndDropData } from '../use/useDragAndDropData';

export const SearchResult = () => {
    const { usersCollection, result, tagsPerPage } = useContext(Data);
    const showingResult = reflect(() => {
        const num = untrack(tagsPerPage);
        return result().slice(0, num);
    });

    // fixed 修复搜索完成之后没回去的问题
    let searchResult: HTMLDivElement;
    createEffect(on(showingResult, () => searchResult.scrollTo(0, 0)));

    const { t } = useTranslation();
    const { send } = useDragAndDropData();
    return (
        <section
            class="search-results my-2 flex h-full flex-wrap content-start  overflow-y-auto overflow-x-hidden"
            ref={searchResult}
        >
            <For each={showingResult()} fallback={() => <div>{t('hint.LoadingData')}</div>}>
                {(item) => (
                    <TagButton
                        draggable={true}
                        onDragStart={(item, data) => {
                            send(data, {
                                type: 'ADD_BEFORE',
                                data: item.en,
                            });
                        }}
                        data={item}
                        onClick={(item) => usersCollection((i) => [...i, CreateIData(item)])}
                    ></TagButton>
                )}
            </For>
        </section>
    );
};
