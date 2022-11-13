import { createMemo, Show, useContext } from 'solid-js';
import { SettingPanel } from './Panels/SettingPanel';
import { PublicPanel } from './Panels/PublicPanel';
import { UploadPanel } from './Panels/UploadPanel';
import { Data } from './App';
import { HomePanel } from './Panels/HomePanel';
import { Webview } from './Panels/Webview';
import { RandomMaker } from './Panels/RandomMaker';
import { FeedBackPanel } from './Feedback/Feedback';
import { MyFeedBackPanel } from './Feedback/MyFeedback';
import { MessageHint } from './MessageHint';
export type PanelIds =
    | 'setting'
    | 'gallery'
    | 'uploader'
    | 'webview'
    | 'random-maker'
    | 'feedback'
    | 'my-feedback'
    // gallery 的 panel
    | 'detail';
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
            <div class="flex-1" classList={{ relative: sideAppMode() }}>
                <SettingPanel></SettingPanel>
                <PublicPanel></PublicPanel>
                <UploadPanel></UploadPanel>
                <HomePanel></HomePanel>
                <Webview></Webview>
                <RandomMaker></RandomMaker>
                <FeedBackPanel></FeedBackPanel>
                <MyFeedBackPanel></MyFeedBackPanel>
            </div>
            <MessageHint></MessageHint>
        </main>
    );
};
