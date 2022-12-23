import { createMemo, Show, useContext } from 'solid-js';
import { SettingPanel } from './Panels/SettingPanel';
import { PublicPanel } from './Panels/PublicPanel';
import { UploadPanel } from './Panels/UploadPanel';
import { Data } from './App';
import { HomePanel } from './Panels/HomePanel';
import { Webview } from './Panels/Webview';
import { FeedBackPanel } from './Feedback/Feedback';
import { MyFeedBackPanel } from './Feedback/MyFeedback';
import { MessageHint } from './MessageHint';
import { AIPrompt } from './Panels/AIPrompt';
import { PromptExtractorPanel } from './Panels/PromptExtractor';
export type PanelIds =
    | 'setting'
    | 'ai-prompt'
    | 'gallery'
    | 'uploader'
    | 'webview'
    | 'feedback'
    | 'my-feedback'
    | 'prompt-extractor'
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

                <FeedBackPanel></FeedBackPanel>
                <MyFeedBackPanel></MyFeedBackPanel>
                <AIPrompt></AIPrompt>
                <PromptExtractorPanel></PromptExtractorPanel>
            </div>
            <MessageHint></MessageHint>
        </main>
    );
};
