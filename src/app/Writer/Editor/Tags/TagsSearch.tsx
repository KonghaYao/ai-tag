import { Show, batch } from 'solid-js';
import { Atom, DebounceAtom, atom, reflect, resource } from '@cn-ui/use';
import { stringToTags } from '../../../../use/TagsConvertor';
import { GlobalData } from '../../../../store/GlobalData';
import type { ITagData } from '../../../main/App';
import { FloatPanel } from '@cn-ui/core';
import { splitTextToAutoComplete } from '../Common/splitTextToAutoComplete';
import { ToolTips } from '../Common/ToolTips';
import qs from 'qs';
import { TagAPI } from '../../../../api/TagAPI';
export const TagsSearch = (props: { userCollection: Atom<ITagData[]> }) => {
    const text = atom('');
    const { r18Mode } = GlobalData.getApp('data');
    const infoList = resource(
        async () => {
            const [originText, q] = splitTextToAutoComplete(text());
            if (!prompt) return [];
            return TagAPI.searchTags(q, r18Mode()).then((res) =>
                res.map((i) => ({ ...i, originText }))
            );
        },
        { immediately: false, initValue: [], deps: [DebounceAtom(text, 200)] }
    );
    const visible = reflect(() => !!infoList().length);
    const tooltipsProvider = reflect<{ originText: string; value: string; desc?: string }[]>(() =>
        infoList().map((i) => ({
            originText: i.originText,
            value: i.en,
            desc: i.cn,
        }))
    );
    return (
        <FloatPanel
            class="flex h-full w-full items-center rounded-md py-1 "
            disabled={true}
            visible={visible}
            popup={({ show }) => {
                return (
                    <Show when={show()}>
                        <aside class="max-h-[30vh] overflow-auto">
                            <ToolTips
                                onConfirm={(str) => text(str)}
                                infoList={tooltipsProvider}
                            ></ToolTips>
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
                    onKeyDown={(e: Event & any) => {
                        if (e.ctrlKey && e.key === 'Enter') {
                            e.stopPropagation();
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
