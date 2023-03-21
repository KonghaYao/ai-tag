import { atom } from '@cn-ui/use';
import { Show, batch, createSelector } from 'solid-js';
import { Panel } from '../components/Panel';
import { GlobalGPT } from '../api/prompt-gpt';
import { Tab, Tabs, TabsHeader } from '@cn-ui/core';
import { TextToText } from './TextToText';

export const PromptGPT = () => {
    const activeId = atom('文生文');
    const isShowing = createSelector(activeId);
    return (
        <Panel id="ai-prompt" class="p-2">
            <header class="py-2 text-center text-lg text-white">AI 魔咒助手</header>
            <Tabs activeId={activeId}>
                <nav class="flex w-full items-end px-4 ">
                    <TabsHeader class="flex-1">
                        {(item) => {
                            return (
                                <button
                                    class="my-4  "
                                    classList={{
                                        'text-lg': isShowing(item),
                                    }}
                                    onclick={() => activeId(item)}
                                >
                                    {item}
                                </button>
                            );
                        }}
                    </TabsHeader>
                    <span
                        class="float-right"
                        onclick={() => {
                            const token = prompt(
                                '输入 OpenAI 的 token。我们不会保存你的 token，完全在你的设备上使用它, 空白为删除你的 token。',
                                GlobalGPT.ownKey
                            );
                            if (token) {
                                GlobalGPT.ownKey = token;
                            } else {
                                GlobalGPT.ownKey = '';
                            }
                        }}
                    >
                        🔑
                    </span>
                </nav>
                <Tab id="文生文" class="flex-1">
                    <TextToText></TextToText>
                </Tab>
            </Tabs>
        </Panel>
    );
};
