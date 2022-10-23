import { reflect } from '@cn-ui/use';
import { For, useContext } from 'solid-js';
import { Data } from './App';
import { Panel } from './components/Panel';

export const SettingPanel = () => {
    const { r18Mode, settingVisible, showCount } = useContext(Data);

    const list = [
        { title: '青少年模式', bind: r18Mode.reflux(!r18Mode(), (i) => !i) },
        { title: '显示数值', bind: showCount },
    ];
    return (
        <Panel visible={settingVisible}>
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
        </Panel>
    );
};
