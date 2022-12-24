import { createMemo, useContext } from 'solid-js';
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
import { Tabs } from '@cn-ui/core';
import { Anime } from '@cn-ui/transition';
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
        <Tabs activeId={visibleId} lazyload>
            <main
                class=" flex h-full w-full flex-none flex-col place-content-center text-gray-400 transition-all duration-500"
                classList={{
                    'flex-1 blur-background md:w-96': hasOpened(),
                    'pointer-events-none w-0': !hasOpened(),

                    fixed: !sideAppMode(),
                }}
            >
                <div class="relative flex-1">
                    <Anime group in="zoom_in" out="zoom_out" appear>
                        <SettingPanel></SettingPanel>
                        <PublicPanel></PublicPanel>
                        <UploadPanel></UploadPanel>
                        <HomePanel></HomePanel>
                        <Webview></Webview>

                        <FeedBackPanel></FeedBackPanel>
                        <MyFeedBackPanel></MyFeedBackPanel>
                        <AIPrompt></AIPrompt>
                        <PromptExtractorPanel></PromptExtractorPanel>
                    </Anime>
                </div>
                <MessageHint></MessageHint>
            </main>
        </Tabs>
    );
};
