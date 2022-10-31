import { For, useContext } from 'solid-js';
import { Data } from '../App';
import { Panel } from '../components/Panel';

export const SettingPanel = () => {
    const { r18Mode, showCount, tagsPerPage, sideAppMode, MaxEmphasize } = useContext(Data);

    const list = [
        { title: '青少年模式', bind: r18Mode.reflux(!r18Mode(), (i) => !i) },
        { title: '显示数值', bind: showCount },
        { title: '侧边应用模式', bind: sideAppMode },
    ];
    const NumberList = [
        { title: '每页 tags 数', bind: tagsPerPage },
        { title: '最大强调层数', bind: MaxEmphasize },
    ];
    return (
        <Panel id="setting">
            <h3 class="my-2 text-center text-lg font-bold">设置面板</h3>
            <For each={list}>
                {(item) => {
                    return (
                        <nav
                            class="mx-4 my-2 flex justify-between"
                            onClick={() => {
                                item.bind((i) => !i);
                            }}
                        >
                            <label>{item.title}</label>
                            <div
                                class="h-6 w-6 rounded-md border border-solid border-slate-700 transition-colors duration-300"
                                classList={{
                                    'bg-blue-500': item.bind(),
                                    'bg-gray-800': !item.bind(),
                                }}
                            ></div>
                        </nav>
                    );
                }}
            </For>
            <For each={NumberList}>
                {(item) => {
                    return (
                        <nav class="mx-4 my-2 flex justify-between">
                            <label>{item.title}</label>
                            <input
                                class="w-32 appearance-none rounded-md border border-solid border-gray-600 bg-gray-800 px-6 text-center text-gray-500 outline-none"
                                value={item.bind()}
                                type="number"
                                min={0}
                                onChange={(e) => {
                                    /** @ts-ignore */
                                    item.bind(parseInt(e.target.value));
                                }}
                            />
                        </nav>
                    );
                }}
            </For>
            <div class="flex-1"></div>
        </Panel>
    );
};
