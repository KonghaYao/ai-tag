import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';
import { createResource, For } from 'solid-js';
import { atom, reflect } from '@cn-ui/use';
import Fuse from 'fuse.js';
import copy from 'copy-to-clipboard';
export const App = () => {
    const [data] = createResource<ArrayBuffer>(() =>
        fetch('/tags.csv').then((res) => res.arrayBuffer())
    );
    const lists = reflect<{ cn: string; en: string }[]>(() => {
        if (data()) {
            const workbook = XLSX.read(data());
            const json = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
            return json;
        }
    });
    const query = reflect(() => {
        if (lists()) {
            return new Fuse(lists(), {
                // isCaseSensitive: false,
                // includeScore: false,
                // shouldSort: true,
                // includeMatches: false,
                // findAllMatches: false,
                // minMatchCharLength: 1,
                // location: 0,
                threshold: 0.6,
                distance: 100,
                useExtendedSearch: true,
                // ignoreLocation: false,
                // ignoreFieldNorm: false,
                // fieldNormWeight: 1,
                keys: ['cn', 'en'],
            });
        }
    });
    const searchText = atom<string>('');

    const result = reflect(() => {
        const text = searchText();
        if (text) {
            const result = query().search(text);
            console.log(result);
            return result.map((i) => i.item);
        } else {
            return lists()?.slice(0, 100) || [];
        }
    });
    const usersCollection = atom<{ cn: string; en: string }[]>([]);
    const enMode = atom<boolean>(false);
    const deleteMode = atom<boolean>(false);
    return (
        <div class="flex h-screen w-screen flex-col bg-black p-4 text-gray-400">
            <h2 class="text-center text-xl font-bold"> AI 绘画三星法器 —— 魔导绪论</h2>
            <header class="flex py-2 text-lg font-bold ">
                <span>你的魔法词</span>
                <span class="flex-1"></span>
                <span
                    class="mx-1 cursor-pointer select-none rounded border  border-solid px-1 font-thin"
                    classList={{
                        'bg-gray-700 border-gray-800': deleteMode(),
                        'border-gray-800': !deleteMode(),
                    }}
                    onclick={() => deleteMode((i) => !i)}
                >
                    删除模式
                </span>
                <span
                    class="mx-1 cursor-pointer select-none rounded border  border-solid border-gray-700 px-1 font-thin"
                    onclick={() => enMode((i) => !i)}
                >
                    {enMode() ? '英文模式' : '中文模式'}
                </span>
                <span
                    class="mx-1 select-none rounded border  border-solid border-gray-700 bg-gray-700 px-1 font-thin transition-colors active:cursor-pointer"
                    onclick={() => {
                        const en = enMode();
                        copy(
                            usersCollection()
                                .map((item) => {
                                    return en ? item.en : item.cn;
                                })
                                .join(',')
                        );
                    }}
                >
                    复制魔法词
                </span>
            </header>
            <div class="flex flex-wrap">
                <For each={usersCollection()}>
                    {(item) => {
                        return (
                            <div
                                class="m-2 cursor-pointer select-none rounded-lg bg-gray-800 p-1"
                                onclick={() => {
                                    deleteMode() &&
                                        usersCollection((i) => i.filter((it) => it !== item));
                                }}
                            >
                                {enMode() ? item.en : item.cn}
                            </div>
                        );
                    }}
                </For>

                {usersCollection().length === 0 && (
                    <span class="text-sm font-light">点击下面的关键词添加</span>
                )}
            </div>

            <input
                class="my-4 rounded-lg bg-gray-700 px-4 py-1 text-gray-200 shadow-md outline-none"
                placeholder="搜索关键词，中文也可以"
                onchange={(e) => {
                    searchText(e.target.value);
                }}
            ></input>
            <section class="flex h-full w-full flex-1 flex-col overflow-hidden">
                <nav class="text-gray-600">
                    搜索结果 {result().length} / {lists() ? lists().length : '加载中'}
                </nav>
                <section class="flex h-full flex-wrap items-start overflow-auto">
                    <For each={result() || []}>
                        {(item) => {
                            return (
                                <nav
                                    class="text-col m-2 flex cursor-pointer select-none flex-col rounded-md bg-gray-600 px-2 py-1 text-center"
                                    onclick={() => {
                                        usersCollection((i) => [...i, item]);
                                    }}
                                >
                                    <div>{item.cn}</div>
                                    <div>{item.en}</div>
                                </nav>
                            );
                        }}
                    </For>
                </section>
            </section>
        </div>
    );
};
