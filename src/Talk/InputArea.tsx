import { atom, resource } from '@cn-ui/use';
import { For, Show, useContext } from 'solid-js';
import { EmojiList, TalkMarkdown } from './TalkMarkdown';
import { TalkContext } from './TalkContext';
import { FloatPanelWithAnimate } from '@cn-ui/core';
import '@cn-ui/animate/src/scale.css';
import { Data } from '../App';
import { useCommitComment } from './commit';
import { Notice } from '../utils/notice';
import { CommentItem } from './CommentList';
export const InputArea = () => {
    const { username } = useContext(Data);
    const { url, atSomeone, refreshPage } = useContext(TalkContext);
    const { commit } = useCommitComment();
    const CommitResource = resource(
        async () => {
            if (!mainText()) return Notice.error('请输入文本捏') as null;
            if (!username()) return Notice.error('请输入一个名称吧') as null;
            return commit(
                {
                    url,
                    comment: mainText(),
                    nick: username(),
                },
                atSomeone()
            ).then(() => {
                mainText('');
                atSomeone(null);
                refreshPage()();
                Notice.success('发布成功');
            });
        },
        undefined,
        false
    );
    const mainText = atom('');
    const PreviewMode = atom(false);

    return (
        <div class="flex flex-col p-2">
            <Show when={atSomeone()}>
                <div class="my-1 rounded-lg bg-slate-700 p-2">
                    <header class="my-1 flex justify-between border-b border-slate-600">
                        <div>你想要回复</div>
                        <div
                            class="cursor-pointer"
                            onclick={() => {
                                atSomeone(null);
                            }}
                        >
                            ❌
                        </div>
                    </header>
                    <CommentItem data={atSomeone()} subChildren={[]} subMode={true}></CommentItem>
                </div>
            </Show>

            <input
                class="w-full rounded-lg bg-slate-600 px-1 outline-none"
                type="text"
                value={username()}
                oninput={(e) => username((e.target as any).value)}
                placeholder="请输入你的昵称吧"
            />

            <textarea
                placeholder="输入你的善意"
                class="my-2 max-h-[50vh] min-h-[20vh] w-full rounded-lg bg-slate-600 p-2 outline-none"
                value={mainText()}
                oninput={(e) => mainText((e.target as any).value)}
                cols="30"
            ></textarea>

            <footer class="flex gap-2">
                <FloatPanelWithAnimate
                    animateProps={{ anime: 'scale' }}
                    // visible={true}
                    // disabled={true}
                    popup={() => {
                        return (
                            <div class="blur-background flex w-screen max-w-xs flex-wrap gap-1 rounded-sm p-2">
                                <EmojiList
                                    onChoose={(text) => {
                                        mainText((i) => i + `${text}`);
                                    }}
                                ></EmojiList>
                            </div>
                        );
                    }}
                >
                    <span class="scale-125 cursor-pointer  rounded-md">😄</span>
                </FloatPanelWithAnimate>
                <FloatPanelWithAnimate
                    animateProps={{ anime: 'scale' }}
                    visible={PreviewMode}
                    // disabled={true}

                    popup={() => {
                        return (
                            <div class="blur-background w-screen  max-w-xs">
                                <header>预览视口</header>
                                <TalkMarkdown code={mainText()}></TalkMarkdown>
                            </div>
                        );
                    }}
                >
                    <span
                        class="scale-125 cursor-pointer  rounded-md"
                        onclick={() => PreviewMode((i) => !i)}
                    >
                        📝
                    </span>
                </FloatPanelWithAnimate>
                <div class="flex-1"></div>
                <div
                    class="btn"
                    onClick={() => {
                        CommitResource.refetch();
                    }}
                >
                    发布信息
                </div>
            </footer>
        </div>
    );
};
