import { For, useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data } from './App';

export const UserSelected = () => {
    const { deleteMode, enMode, usersCollection } = useContext(Data);
    return (
        <main class="my-2 flex w-full flex-col rounded-xl border border-solid border-gray-600 p-2">
            <header class="flex py-2  text-sm font-bold">
                <span
                    class="mx-1 cursor-pointer select-none rounded border  border-solid px-1  font-thin"
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
                    class="mx-1 cursor-pointer select-none rounded  border border-solid  border-gray-700 px-1 font-thin transition-colors active:bg-gray-700"
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
                    一键复制
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
        </main>
    );
};
