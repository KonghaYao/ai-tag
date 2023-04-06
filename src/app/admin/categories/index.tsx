import { usePagination } from '@cn-ui/reactive';
import { AV } from '../../../api/cloud';
import { For } from 'solid-js';

export const CategoriesPicker = () => {
    const { currentData, next, prev, currentPage, maxPage } = usePagination(
        async (page, maxPage) => {
            const q = new AV.Query('gallery');
            q.addDescending('create_time');

            return q
                .limit(10)
                .skip(page * 10)
                .findAndCount()
                .then(([res, count]) => {
                    maxPage(Math.ceil(count / 10));
                    return res;
                });
        },
        {}
    );
    return (
        <section>
            <header>
                <button onclick={prev}>👈</button>
                <span>
                    {currentPage()}/{maxPage()}
                </span>
                <button onclick={next}>👉</button>
            </header>
            <main class="grid grid-cols-6">
                <For each={currentData()}>
                    {(item) => {
                        const data = item.toJSON();
                        return (
                            <div>
                                <img height="100" width="100" src={data.image} />
                                <nav>
                                    <For each={data.categories}>
                                        {(item, index) => {
                                            return (
                                                <button
                                                    title="双击删除"
                                                    onclick={() => {
                                                        const arr = [...item.get('categories')];
                                                        console.log(arr);
                                                        arr.splice(index(), 1);
                                                        item.set('categories', arr);
                                                        item.save();
                                                    }}
                                                >
                                                    {item}
                                                </button>
                                            );
                                        }}
                                    </For>
                                    <button
                                        onclick={() => {
                                            const cat = prompt('输入分类');
                                            if (cat) {
                                                item.set('categories', [
                                                    ...item.get('categories'),
                                                    cat,
                                                ]);
                                                item.save({ useMasterKey: true });
                                            }
                                        }}
                                    >
                                        +
                                    </button>
                                </nav>
                            </div>
                        );
                    }}
                </For>
            </main>
        </section>
    );
};
