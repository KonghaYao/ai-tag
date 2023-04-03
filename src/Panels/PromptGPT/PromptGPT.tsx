import { atom } from '@cn-ui/use';
import { JSXElement, Show, createSelector } from 'solid-js';
import { GlobalGPT } from '../../api/prompt-gpt';
import { Tab, Tabs, TabsHeader } from '@cn-ui/core';
import { TextToText } from './TextToText';
import { MeetsAI } from './MeetsAI';
import { GlobalData } from '../../store/GlobalData';

export const InputOpenAIToken = (props: { class?: string; children?: JSXElement }) => {
    return (
        <span
            class={props.class + ' cursor-pointer'}
            onclick={() => {
                const token = prompt(
                    '输入 OpenAI 的 token。我们不会保存你的 token，它只保存在你的设备中； 空白为删除你的 token。',
                    GlobalGPT.ownKey
                );
                if (token) {
                    GlobalGPT.ownKey = token;
                } else {
                    GlobalGPT.ownKey = '';
                }
            }}
        >
            🔑 {props.children}
        </span>
    );
};

export const PromptGPT = () => {
    const activeId = atom('文生文');
    const isShowing = createSelector(activeId);
    const { r18Mode } = GlobalData.getApp('data');
    return (
        <>
            <header class="py-2 text-center text-lg text-white" title="AI 辅助加强文本">
                AI 魔咒助手
            </header>
            <Tabs activeId={activeId} lazyload>
                <nav class="flex w-full items-end px-4 ">
                    <TabsHeader class="flex-1">
                        {(item) => {
                            return (
                                <button
                                    class="  underline-offset-2"
                                    classList={{
                                        'text-2xl underline ': isShowing(item),
                                    }}
                                    onclick={() => activeId(item)}
                                >
                                    {item}
                                </button>
                            );
                        }}
                    </TabsHeader>
                    <InputOpenAIToken class="float-right"></InputOpenAIToken>
                </nav>
                <Tab id="文生文" class="flex-1">
                    <TextToText></TextToText>
                </Tab>
                <Show when={r18Mode()}>
                    {/* TODO 很奇怪 lazyload 没生效导致页面加载了数据 */}
                    <Tab id="遇见 AI">
                        <MeetsAI></MeetsAI>
                    </Tab>
                </Show>
            </Tabs>
        </>
    );
};
