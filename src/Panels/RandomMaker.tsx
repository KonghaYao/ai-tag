import { Atom, atom } from '@cn-ui/use';
import { sample } from 'lodash-es';
import { createEffect, For, useContext } from 'solid-js';
import { Data, IData } from '../App';
import { Panel, PanelContext } from '../components/Panel';
import { SortableList } from '../components/sortable';
export interface PickDataType {
    name: string;
    tags: Atom<IData[]>;
}
/** 抽取一个不重叠的元素 */
function findMore<T>(origin: T[], input: T[], equal = Object.is) {
    const last = origin.filter((i) => !input.find((it) => equal(it, i)));
    if (last.length >= 1) {
        return sample(last);
    } else {
        return null;
    }
}
import { TagButton } from '../components/TagButton';
import { CombineMagic } from '../utils/CombineMagic';
import { useRandomMaker } from '../use/useRandomMaker';
export const RandomMaker = () => {
    const { isPanelVisible } = useContext(PanelContext);
    const { usersCollection, deleteMode } = useContext(Data);
    const voidId = Math.random().toString();
    const { pickData, baseData, addClassify, loadData } = useRandomMaker();
    let firstTime = true;
    createEffect(() => {
        if (isPanelVisible('random-maker') && firstTime) {
            loadData();
            firstTime = !firstTime;
        }
    });
    return (
        <Panel id="random-maker">
            <div class="flex h-full w-full flex-col">
                <header class="py-2 text-center font-bold"> 二分之三魔咒构建生成器</header>
                {baseData() && (
                    <div class="flex justify-evenly">
                        <span>选择需要的大类</span>
                        <select
                            value={atom('')()}
                            class="w-36 appearance-none bg-gray-700 outline-none"
                            onchange={(e: any) => addClassify(e.target.value)}
                        >
                            <For each={Object.keys(baseData())}>
                                {(item) => (
                                    <option class="py-2 text-center" value={item}>
                                        {item}
                                    </option>
                                )}
                            </For>
                        </select>
                    </div>
                )}
                <div class="h-full w-full flex-1 overflow-auto">
                    <SortableList
                        class="flex flex-col overflow-y-auto overflow-x-hidden  text-sm"
                        each={pickData}
                        getId={(el) => el.name}
                        options={{}}
                        disabled={atom(false)}
                        void={
                            {
                                name: voidId,
                            } as PickDataType
                        }
                    >
                        {(item) => {
                            if (item.name === voidId) return <div data-id={voidId}></div>;
                            return (
                                <main data-id={item.name} class="p-2">
                                    <div class="flex justify-between font-bold">
                                        {item.name}
                                        <div
                                            class="btn"
                                            onclick={() => {
                                                // 添加随机一个
                                                const newItem = findMore(
                                                    baseData()[item.name].tags,
                                                    item.tags(),
                                                    (a, b) => a.en === b.en
                                                );
                                                newItem && item.tags((i) => [...i, newItem]);
                                            }}
                                        >
                                            加一
                                        </div>
                                        <span
                                            class="btn"
                                            classList={{
                                                'bg-gray-700 border-gray-800': deleteMode(),
                                            }}
                                            onclick={() => deleteMode((i) => !i)}
                                        >
                                            删除模式
                                        </span>
                                    </div>
                                    {/* <SortableList></SortableList> */}
                                    <SortableList
                                        class="flex flex-wrap overflow-y-auto overflow-x-hidden  text-sm"
                                        style={{
                                            'max-height': '20vh',
                                        }}
                                        each={item.tags}
                                        getId={(el) => el.en}
                                        options={{}}
                                        disabled={atom(false)}
                                        void={
                                            {
                                                en: voidId,
                                                cn: '',
                                                r18: 0,
                                                emphasize: 0,
                                                count: 0,
                                            } as IData
                                        }
                                    >
                                        {(it) => {
                                            if (it.en === voidId)
                                                return <div data-id={voidId}></div>;
                                            return (
                                                <TagButton
                                                    data={it}
                                                    onClick={() => {
                                                        deleteMode() &&
                                                            item.tags((i) =>
                                                                i.filter((i) => i.en !== it.en)
                                                            );
                                                    }}
                                                ></TagButton>
                                            );
                                        }}
                                    </SortableList>
                                </main>
                            );
                        }}
                    </SortableList>
                </div>
                <footer class="flex w-full gap-2 overflow-hidden rounded-lg p-4 text-center text-white">
                    <div
                        class="flex-1 cursor-pointer bg-green-700"
                        onClick={() => usersCollection(pickData().flatMap((i) => i.tags()))}
                    >
                        覆盖魔法
                    </div>
                    <div
                        class="flex-1 cursor-pointer bg-green-700"
                        onClick={() =>
                            CombineMagic(
                                pickData().flatMap((i) => i.tags()),
                                usersCollection
                            )
                        }
                    >
                        融合魔法
                    </div>
                </footer>
            </div>
        </Panel>
    );
};
