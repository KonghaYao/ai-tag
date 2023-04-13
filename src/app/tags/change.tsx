import { Tab, Tabs } from '@cn-ui/core';
import { Atom, DebounceAtom, atom, resource } from '@cn-ui/reactive';
import { TagAPI } from '../../api/TagAPI';
import { For } from 'solid-js';
import { Notice } from '../../utils/notice';

export const TagsChangePage = () => {
    return (
        <section class="w-screen p-4">
            <div>Tag 编辑器</div>

            <Tabs activeId={'增加'}>
                <Tab id="增加">
                    <TagsAdd></TagsAdd>
                </Tab>
                <Tab id="修改"></Tab>
                <Tab id="删除"></Tab>
            </Tabs>
        </section>
    );
};

export const TagsAdd = () => {
    const text = atom('');
    return (
        <form
            class="flex w-full flex-col gap-2 "
            onsubmit={(e) => {
                e.preventDefault();
                const it = e.target as HTMLFormElement;
                const fd = new FormData(it);
                const data: any = Object.fromEntries(fd.entries());
                if ('r18' in data) {
                    data.r18 = true;
                } else {
                    data.r18 = false;
                }
                it.reset();
                Notice.success('已经提交保存，等待审核完成，感谢您的参与😄');
                console.log(data, fd);
            }}
        >
            <blockquote>请根据英文构造 Tag，填写下面表单并提交即可</blockquote>
            <label>
                <span>英文名称</span>
                <input
                    type="text"
                    name="en"
                    value={text()}
                    oninput={(e) => {
                        text((e.target as any).value);
                    }}
                />
            </label>
            <label>
                <span>中文名称</span>
                <input type="text" name="cn" />
            </label>
            <label>
                <span>大致效果数值</span>
                <input type="number" name="count" min="0" max={Infinity} />
            </label>
            <blockquote>大致效果数值是显示在右上角的数值，可以更好地对比该 Tag 的作用</blockquote>
            <label>
                <span>🔞 R18</span>
                <input type="checkbox" name="r18" value="1" />
            </label>

            <output class="my-1 max-h-[50vh] overflow-auto rounded-md p-2 outline outline-1 outline-slate-400">
                <div>相似词汇（如有，则不要添加了😄）</div>
                <RelateTags text={text}></RelateTags>
            </output>

            <button class="btn rounded-md bg-green-700 text-slate-50" type="submit">
                提交
            </button>
        </form>
    );
};

/** 用于显示 Tags 的相似指数 */
export const RelateTags = (props: { text: Atom<string> }) => {
    const data = resource(() => TagAPI.searchTags(props.text(), true), {
        immediately: false,
        initValue: [],
        deps: [DebounceAtom(props.text, 300)],
    });
    return (
        <ul class=" text-xs">
            <For each={data()}>
                {(item) => {
                    return (
                        <li class="flex gap-1 hover:bg-slate-600">
                            <span>{item.en}</span>
                            <span>{item.cn}</span>
                            <span>{item.count}</span>
                            <span>{item.r18 ? '🔞' : ''}</span>
                        </li>
                    );
                }}
            </For>
        </ul>
    );
};
