import { render } from 'solid-js/web';
import { proxy, ProxyMarked } from 'comlink';
import { onMount } from 'solid-js';
import { atom } from '@cn-ui/use';
import './index.css';
// 这个代码是 JS 通用的代码
import { useMagicAPI } from './useMagicAPI';

const App = () => {
    let container: HTMLIFrameElement;
    let magic: ReturnType<typeof useMagicAPI>;
    onMount(() => {
        magic = useMagicAPI(container);
        magic.getMagicAPI().then(async (api) => {
            loading(false);
            // 获取 Prompt
            await api.getPrompt().then((res) => prompt(res));
            // 监听 Prompt 变化
            await api.onPromptChange(
                proxy((item) => {
                    console.log(item);
                    prompt(item);
                })
            );
        });
    });
    const loading = atom(true);
    const prompt = atom<string>('');
    return (
        <div class="flex h-screen w-screen ">
            <div class="h-full w-full max-w-sm p-4">
                <iframe
                    sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin allow-storage-access-by-user-activation"
                    class="h-full w-full appearance-none  overflow-hidden rounded-lg border-none shadow-xl"
                    ref={container}
                    src="./index.html?tags=348923849"
                ></iframe>
            </div>
            <div class="flex flex-col p-4">
                <div class="py-2 text-lg font-bold ">这是另一个网站</div>
                <span class="text-sm font-thin text-green-700">
                    {loading() ? '加载中' : '已经链接到魔导绪论'}
                </span>
                <div class="text-xs font-thin">下面的数据可以和魔导绪论进行互通</div>
                <textarea
                    class="my-2 flex-1 border border-solid border-gray-600 bg-gray-200 outline-none"
                    value={prompt()}
                    onChange={(e) => {
                        console.log('注入本站变量');
                        prompt((e.target as any).value);
                    }}
                ></textarea>
                <div
                    class="cursor-pointer bg-green-800 text-center text-white"
                    onClick={() => {
                        magic.getMagicAPI().then(async (api) => {
                            api.inputPrompt(prompt());
                        });
                    }}
                >
                    写回编辑器
                </div>
            </div>
        </div>
    );
};
render(() => <App></App>, document.body);
