import { Component, For, Show, batch, createEffect } from 'solid-js';
import type { Block } from '../App';
import { TagsRow } from '../../main/UserSelected';
import { Atom, DebounceAtom, ResourceAtom, addListener, atom, reflect, resource } from '@cn-ui/use';
import { TagsToString, stringToTags } from '../../../use/TagsConvertor';
import { GlobalData } from '../../../store/GlobalData';
import { ContentEditable } from '../../../components/ContentEditable';
import type { ITagData } from '../../main/App';
import { FloatPanel } from '@cn-ui/core';
import { splitTextToAutoComplete } from './Common/splitTextToAutoComplete';
import { Transformers } from './Common/Transformers';
import copy from 'copy-to-clipboard';
import { Notice } from '../../../utils/notice';

export const TagsEditor: Component<{ block: Block }> = (props) => {
    const { emphasizeAddMode, deleteMode, changeTagMode } = GlobalData.getApp('data');
    const userCollection = atom(stringToTags(props.block.content.text));

    const inputMode = atom(true);
    return (
        <div class="flex items-center gap-2  rounded-xl border border-solid border-slate-600 p-2">
            <ul class="flex flex-col items-center gap-1">
                <li
                    class="cursor-pointer"
                    classList={{
                        'rounded-md bg-slate-600': emphasizeAddMode(),
                    }}
                    title="添加模式，左键加权，右键减权"
                    onClick={() => changeTagMode(emphasizeAddMode, true)}
                >
                    🏷️
                </li>
                <li
                    class="cursor-pointer"
                    classList={{
                        'rounded-md bg-slate-600': deleteMode(),
                    }}
                    title="删除模式，点击删除"
                    onClick={() => changeTagMode(deleteMode, true)}
                >
                    ❌
                </li>
                <li
                    class="cursor-pointer"
                    title="一键复制"
                    onClick={() => (
                        copy(TagsToString(userCollection())), Notice.success('复制成功')
                    )}
                >
                    📝
                </li>
                <li
                    class="cursor-pointer"
                    classList={{
                        'rounded-md bg-slate-600': inputMode(),
                    }}
                    title="删除模式，点击删除"
                    onClick={() => inputMode((i) => !i)}
                >
                    ✒️
                </li>
                <Transformers block={props.block}></Transformers>
            </ul>

            <div class="flex-1 transition-all">
                <TagsRow usersCollection={userCollection}></TagsRow>
                <Show when={inputMode()}>
                    <TagsSearch userCollection={userCollection}></TagsSearch>
                </Show>
            </div>
        </div>
    );
};

export const ToolTips: Component<{
    infoList: ResourceAtom<(ITagData & { originText: string })[]>;
    text: Atom<string>;
}> = ({ infoList, text }) => {
    const focusing = atom(0);
    let container!: HTMLUListElement;
    addListener(window, 'keydown', (e: any) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                focusing((i) => (i < infoList().length - 1 ? i + 1 : i));
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusing((i) => (i > 0 ? i - 1 : i));
                break;
            case 'Enter':
                e.preventDefault();
                (container?.children[focusing()] as HTMLElement)?.click();
                break;
        }
    });

    return (
        <ul ref={container} class="mt-2 w-full max-w-sm rounded-md bg-slate-800 p-2 text-slate-300">
            <For each={infoList()}>
                {(item, index) => {
                    let it!: HTMLLIElement;
                    const isSelect = reflect(() => focusing() === index());
                    createEffect(() => {
                        isSelect() && it!.scrollIntoView(false);
                    });
                    return (
                        <li
                            class="pl-2 hover:bg-slate-600"
                            classList={{
                                'bg-slate-700': isSelect(),
                            }}
                            onclick={(e) => {
                                console.log(it.textContent);
                                batch(() => {
                                    text(item.originText + it.textContent + ' ');
                                    infoList([]);
                                });
                            }}
                        >
                            <span class="pr-4">{item.cn}</span>
                            <span
                                ref={it}
                                class="max-w-[50%] text-ellipsis whitespace-nowrap text-xs text-slate-200"
                            >
                                {item.en}
                            </span>
                            <Show when={isSelect()}>
                                <span class="float-right">✅</span>
                            </Show>
                        </li>
                    );
                }}
            </For>
        </ul>
    );
};

export const TagsSearch = (props: { userCollection: Atom<ITagData[]> }) => {
    const text = atom('');
    const { r18Mode } = GlobalData.getApp('data');
    const infoList = resource(
        async () => {
            const [originText, q] = splitTextToAutoComplete(text());
            if (!prompt) return [];
            return fetch('https://able-hare-95.deno.dev/tags', {
                method: 'POST',
                body: JSON.stringify({
                    text: q,
                    options: {
                        filter: !r18Mode() && `r18 != 1`,
                    },
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    return res.hits as ITagData[];
                })
                .then((res) => res.map((i) => ({ ...i, originText })));
        },
        { immediately: false, initValue: [], deps: [DebounceAtom(text, 200)] }
    );
    const visible = reflect(() => !!infoList().length);
    return (
        <FloatPanel
            class="flex h-full w-full items-center rounded-md py-1"
            disabled={true}
            visible={visible}
            popup={({ show }) => {
                return (
                    <Show when={show()}>
                        <aside class="max-h-[50vh] overflow-auto">
                            <ToolTips text={text} infoList={infoList}></ToolTips>
                        </aside>
                    </Show>
                );
            }}
        >
            <aside class="mx-2 flex w-full items-center gap-2 rounded-md  border  border-solid border-slate-600 bg-slate-800 px-2">
                <div>✒️</div>
                <input
                    class=" w-full flex-1 bg-transparent outline-none"
                    placeholder="在这里输入 Tags; Ctrl+Enter 添加"
                    value={text()}
                    oninput={(e) => text((e.target as any).value)}
                    // 避免立即删除
                    onblur={() => setTimeout(() => visible(false), 100)}
                    onKeyDown={(e: any) => {
                        if (e.ctrlKey && e.key === 'Enter') {
                            batch(() => {
                                props.userCollection((i) => [...i, ...stringToTags(text(), [])]);
                                text('');
                            });
                        }
                    }}
                ></input>
            </aside>
        </FloatPanel>
    );
};
