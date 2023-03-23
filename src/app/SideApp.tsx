import { createMemo, useContext } from 'solid-js';
import { SettingPanel } from '../Panels/SettingPanel';
import { UploadPanel } from '../Panels/UploadPanel';
import { HomePanel } from '../Panels/HomePanel';
import { Webview } from '../Panels/Webview';
import { FeedBackPanel } from '../Panels/Feedback/Feedback';
import { MyFeedBackPanel } from '../Panels/Feedback/MyFeedback';
import { PromptExtractorPanel } from '../Panels/PromptExtractor';
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
    | 'home'
    // gallery 的 panel
    | 'detail'
    | 'backup';

import { Animate } from '@cn-ui/animate';
import { TalkPanel } from '../Panels/TalkPanel';
import { ArtistPanel } from '../Panels/artist';
import { PromptGPT } from '../Panels/PromptGPT/PromptGPT';
import { GlobalData } from '../store/GlobalData';
export const SideApp = () => {
    const { sideAppMode, visibleId } = GlobalData.getApp('side-app')!;
    const hasOpened = createMemo(() => visibleId() !== '');
    return (
        <Tabs activeId={visibleId} lazyload>
            <section
                class=" flex h-full w-full flex-none flex-col place-content-center text-gray-400 transition-all duration-500"
                classList={{
                    'flex-1 blur-background md:w-96': hasOpened(),
                    'pointer-events-none w-0': !hasOpened(),

                    fixed: !sideAppMode(),
                }}
            >
                <nav class="relative flex-1">
                    <Animate group anime="jumpFromBottom" appear>
                        <SettingPanel></SettingPanel>

                        <UploadPanel></UploadPanel>
                        <HomePanel></HomePanel>
                        <Webview></Webview>

                        <FeedBackPanel></FeedBackPanel>
                        <MyFeedBackPanel></MyFeedBackPanel>
                        <PromptGPT></PromptGPT>
                        <PromptExtractorPanel></PromptExtractorPanel>
                        <TalkPanel></TalkPanel>
                        <ArtistPanel></ArtistPanel>
                    </Animate>
                </nav>
            </section>
        </Tabs>
    );
};
