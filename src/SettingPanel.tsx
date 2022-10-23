import { reflect } from '@cn-ui/use';
import { For, useContext } from 'solid-js';
import { Data } from './App';

export const SettingPanel = () => {
    const { r18Mode, settingVisible, showCount } = useContext(Data);
    let container: HTMLDivElement;

    const list = [
        { title: '青少年模式', bind: r18Mode.reflux(!r18Mode(), (i) => !i) },
        { title: '显示数值', bind: showCount },
    ];
    return (
        <nav
            ref={container}
            class="absolute top-0 left-0 flex h-screen w-screen items-center justify-center p-12 transition-all duration-300"
            classList={{
                'scale-100': settingVisible(),

                'scale-0': !settingVisible(),
                'pointer-event-none': !settingVisible(),
            }}
            onClick={(e) => {
                if (e.target === container) settingVisible(false);
                // console.log(e);
            }}
        >
            <main
                class={
                    'flex h-full w-full max-w-sm flex-col overflow-auto rounded-2xl border border-solid border-slate-700 shadow-xl backdrop-blur transition-all'
                }
            >
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
            </main>
        </nav>
    );
};
