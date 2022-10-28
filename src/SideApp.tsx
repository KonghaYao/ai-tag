import { createMemo, Show, useContext } from 'solid-js';
import { SettingPanel } from './SettingPanel';
import { PublicPanel } from './PublicPanel';
import { UploadPanel } from './UploadPanel';
import { Data } from './App';
export type PanelIds = 'setting' | 'gallery' | 'uploader';
export const SideApp = () => {
    const { sideAppMode, visibleId } = useContext(Data);

    const hasOpened = createMemo(() => !!visibleId());

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
            </div>
        </main>
    );
};
export const ControlBar = () => {
    const { visibleId } = useContext(Data);
    return (
        <div class="mx-6 mt-6 flex h-8 items-center justify-end rounded-lg border border-gray-500 bg-gray-800">
            <button class="btn" onclick={() => visibleId(null)}>
                关闭
            </button>
        </div>
    );
};
