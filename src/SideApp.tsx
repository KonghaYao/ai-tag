import { createMemo, useContext } from 'solid-js';
import { SettingPanel } from './Panels/SettingPanel';
import { UploadPanel } from './Panels/UploadPanel';
import { Data } from './App';
import { HomePanel } from './Panels/HomePanel';
import { Webview } from './Panels/Webview';
import { FeedBackPanel } from './Feedback/Feedback';
import { MyFeedBackPanel } from './Feedback/MyFeedback';
import { AIPrompt } from './Panels/AIPrompt';
import { PromptExtractorPanel } from './Panels/PromptExtractor';
import { Tabs } from '@cn-ui/core';
export type PanelIds =
    | 'setting'
    | 'ai-prompt'
    | 'gallery'
    | 'uploader'
    | 'webview'
    | 'feedback'
    | 'my-feedback'
    | 'prompt-extractor'
    | 'talk'
    | 'artist'
    // gallery 的 panel
    | 'detail'
    | 'backup';
import '@cn-ui/animate/src/jump.css';
import { Animate } from '@cn-ui/animate';
import { TalkPanel } from './Panels/TalkPanel';
import { ArtistPanel } from './Panels/artist';
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
                    <Animate group anime="jumpFromBottom" appear>
                        <SettingPanel></SettingPanel>

                        <UploadPanel></UploadPanel>
                        <HomePanel></HomePanel>
                        <Webview></Webview>

                        <FeedBackPanel></FeedBackPanel>
                        <MyFeedBackPanel></MyFeedBackPanel>
                        <AIPrompt></AIPrompt>
                        <PromptExtractorPanel></PromptExtractorPanel>
                        <TalkPanel></TalkPanel>
                        <ArtistPanel></ArtistPanel>
                    </Animate>
                </div>
            </main>
        </Tabs>
    );
};
