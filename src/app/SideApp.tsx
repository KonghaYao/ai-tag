import { For, createEffect, createMemo, useContext } from 'solid-js';
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
import { Panel } from '../components/Panel';
import { useBreakpoints } from '@cn-ui/use';
export const SideApp = (props: { defaultPanel?: '' | PanelIds }) => {
    const { sideAppMode, visibleId, extraPanels } = GlobalData.getApp('side-app')!;

    if (typeof props.defaultPanel === 'string') visibleId(props.defaultPanel);
    console.log(visibleId());
    const { isSize } = useBreakpoints();
    // 自动变换 SideAPP 状态
    createEffect(() => sideAppMode(!(isSize('xs') || isSize('sm'))));
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
                        <Panel id="setting">
                            <SettingPanel></SettingPanel>
                        </Panel>

                        <Panel id="uploader">
                            <UploadPanel></UploadPanel>
                        </Panel>
                        <Panel id="home">
                            <HomePanel></HomePanel>
                        </Panel>
                        <Panel id="webview">
                            <Webview></Webview>
                        </Panel>

                        <Panel id="feedback">
                            <FeedBackPanel></FeedBackPanel>
                        </Panel>
                        <Panel id="my-feedback">
                            <MyFeedBackPanel></MyFeedBackPanel>
                        </Panel>
                        <Panel id="ai-prompt" class="p-2">
                            <PromptGPT></PromptGPT>
                        </Panel>
                        <Panel id="prompt-extractor">
                            <PromptExtractorPanel></PromptExtractorPanel>
                        </Panel>
                        <Panel id="talk">
                            <TalkPanel></TalkPanel>
                        </Panel>
                        <Panel id="artist" class="flex h-full flex-col overflow-hidden">
                            <ArtistPanel></ArtistPanel>
                        </Panel>
                        <For each={[...extraPanels().entries()]}>
                            {([key, Comp]) => {
                                return (
                                    <Panel id={key}>
                                        <Comp></Comp>
                                    </Panel>
                                );
                            }}
                        </For>
                    </Animate>
                </nav>
            </section>
        </Tabs>
    );
};
