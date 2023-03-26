import { createEffect, For, on, Show, useContext } from 'solid-js';
import { TagButton } from '../TagButton';
import { CreateIData } from '../../use/TagsConvertor';
import { DragPoster } from '@cn-ui/headless';
import { GlobalData } from '../../store/GlobalData';

export const SearchResult = () => {
    const { usersCollection, result } = GlobalData.getApp('tag-control');

    // fixed 修复搜索完成之后没回去的问题
    let searchResult!: HTMLDivElement;
    createEffect(
        on(result, (data) => {
            searchResult.scrollTo(0, 0);
        })
    );
    result.refetch();

    return (
        <section
            class="search-results flex h-full flex-wrap content-start  gap-4 overflow-y-auto overflow-x-hidden  pt-4 pb-4"
            ref={searchResult}
        >
            {/*  使用 loading 态同源来解决异步抖动问题 */}
            <Show when={result.isReady() || result.loading()}>
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
            </Show>
        </section>
    );
};
