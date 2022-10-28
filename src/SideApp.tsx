import { createMemo, Show, useContext } from 'solid-js';
import { SettingPanel } from './Panels/SettingPanel';
import { PublicPanel } from './Panels/PublicPanel';
import { UploadPanel } from './Panels/UploadPanel';
import { Data } from './App';
import { HomePanel } from './Panels/HomePanel';
import { Webview } from './Panels/Webview';
import { RandomMaker } from './Panels/RandomMaker';
export type PanelIds = 'setting' | 'gallery' | 'uploader' | 'webview' | 'random-maker';
export const SideApp = () => {
    const { sideAppMode, visibleId } = useContext(Data);

    const hasOpened = createMemo(() => visibleId() !== null);

    return (
        <main
            class="flex h-full w-1/3 max-w-sm flex-none flex-col bg-gray-900 text-gray-400 transition-all duration-300"
            classList={{
                'flex-1': hasOpened(),
                'w-0': !sideAppMode() || !hasOpened(),
            }}
        >
            <Show when={hasOpened()}>
                <ControlBar></ControlBar>
            </Show>
            <div class="flex-1" classList={{ relative: sideAppMode() }}>
                <SettingPanel></SettingPanel>
                <PublicPanel></PublicPanel>
                <UploadPanel></UploadPanel>
                <HomePanel></HomePanel>
                <Webview></Webview>
                <RandomMaker></RandomMaker>
            </div>
        </main>
    );
};
export const ControlBar = () => {
    const { visibleId } = useContext(Data);
    return (
        <div class="mx-6 mt-6 flex h-8 items-center justify-end rounded-lg border border-gray-500 bg-gray-800">
            <div onclick={() => visibleId('random-maker')}> 测试按钮</div>
            <button class="btn" onclick={() => visibleId('')}>
                主页
            </button>
            <button class="btn" onclick={() => visibleId(null)}>
                关闭
            </button>
        </div>
    );
};
