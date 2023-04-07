import { usePagination } from '@cn-ui/reactive';
import { AV } from '../../../api/cloud';
import { For } from 'solid-js';
import { FloatPanel } from '@cn-ui/core';
import { CategoriesInput } from './CategoriesInput';
import { createCategory } from './createCategory';

export const CategoriesPicker = () => {
    if (!AV.User.current()) {
        const username = prompt('用户名');
        const password = prompt('密码');
        AV.User.logIn(username!, password!);
    }
    const { currentData, next, prev, currentPage, maxPage, refetch, goto } = usePagination(
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
                <span
                    onclick={() => {
                        const page = prompt('请输入页码');
                        const pageNum = parseInt(page ?? '');
                        !isNaN(pageNum) && goto(pageNum - 1);
                    }}
                >
                    {currentPage()}/{maxPage()}
                </span>
                <button onclick={next}>👉</button>
                <span>按住图片可放大</span>
                <button class="btn" onclick={() => refetch()}>
                    {' '}
                    更新
                </button>
            </header>
            <main class="grid grid-cols-6">
                <For each={currentData()}>
                    {(item) => {
                        const data = item.toJSON();
                        return (
                            <div>
                                <img
                                    class="active:scale-[4]"
                                    height="100"
                                    width="100"
                                    src={data.image}
                                />
                                <nav class="my-2 flex flex-wrap gap-2">
                                    <For each={data.categories}>
                                        {(cate, index) => {
                                            return (
                                                <button
                                                    class="btn "
                                                    title="双击删除"
                                                    ondblclick={async () => {
                                                        const arr = [...item.get('categories')];

                                                        arr.splice(index(), 1);
                                                        item.set('categories', arr);
                                                        await item.save();

                                                        refetch();
                                                    }}
                                                >
                                                    {cate}
                                                </button>
                                            );
                                        }}
                                    </For>
                                    <CategoriesInput
                                        onselect={async (cat) => {
                                            if (cat) {
                                                const origin = item.get('categories') as string[];
                                                if (origin.includes(cat)) return;
                                                item.set('categories', [...origin, cat]);
                                                try {
                                                    await AV.Object.saveAll([
                                                        item as any,
                                                        createCategory(cat),
                                                    ]);
                                                } catch (e) {}
                                                refetch();
                                            }
                                        }}
                                    ></CategoriesInput>
                                </nav>
                            </div>
                        );
                    }}
                </For>
            </main>
        </section>
    );
};
