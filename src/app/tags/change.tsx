import { Atom, DebounceAtom, ObjectAtom, resource, useEffectWithoutFirst } from '@cn-ui/reactive';
import { TagAPI } from '../../api/TagAPI';
import { For, batch } from 'solid-js';
import { Notice } from '../../utils/notice';
import type { ITagData } from '../main/App';

export const TagsChangePage = () => {
    return (
        <section class="flex h-screen w-screen flex-col overflow-hidden p-4">
            <header class="my-2 w-full text-xl">Tag 编辑器</header>
            <section class="flex-1 overflow-hidden px-2">
                <TagsForm></TagsForm>
            </section>
        </section>
    );
};

/** 增删改全在一起😂 */
export const TagsForm = () => {
    const objItem = ObjectAtom({ r18: 0, en: '', count: 0, cn: '' });
    const { en, count, cn, r18 } = objItem;
    return (
        <form
            class="flex h-full w-full flex-1 flex-col gap-2"
            onsubmit={(e) => {
                e.preventDefault();
                const it = e.target as HTMLFormElement;
                const fd = new FormData(it);
                const data: any = Object.fromEntries(fd.entries());
                data.r18 = 'r18' in data ? 1 : 0;
                data.delete = 'delete' in data ? true : false;
                data.count = parseInt(data.count);

                TagAPI.uploadTag(data).then(() => {
                    it.reset();
                    Notice.success('已经提交保存，等待审核完成，感谢您的参与😄');
                    console.log(data, fd);
                });
            }}
        >
            <blockquote>请根据英文构造 Tag，填写下面表单并提交即可</blockquote>
            <label>
                <span>英文名称</span>
                <input
                    type="text"
                    name="en"
                    value={en()}
                    oninput={(e) => {
                        en((e.target as any).value);
                    }}
                />
            </label>
            <label>
                <span>中文名称</span>
                <input type="text" name="cn" value={cn()} />
            </label>
            <label>
                <span>🔞 R18</span>
                <input type="checkbox" name="r18" value="1" checked={!!r18()} />
            </label>
            <label>
                <span>大致效果数值</span>
                <input type="number" name="count" min="0" max={Infinity} value={count()} />
            </label>
            <blockquote>
                大致效果数值是显示在右上角的数值，可以参考相似词汇的数值进行填写
            </blockquote>

            <blockquote>相似词汇（如有，点击它，然后提交修改即可😄）</blockquote>
            <output class="my-1 max-h-[50vh] flex-1 overflow-auto rounded-md p-2 outline outline-1  outline-slate-400">
                <RelateTags
                    text={en}
                    onDataReturn={(data) => {
                        count(data[0].count);
                    }}
                    onClick={(data) => {
                        console.log(data);
                        batch(() => {
                            en(data.en);
                            cn(data.cn);
                            r18(data.r18);
                            count(data.count);
                        });
                    }}
                ></RelateTags>
            </output>

            <label>
                <span>
                    🚫删除模式？
                    <sub class="text-xs">是否删除这个 Tag</sub>
                </span>
                <input type="checkbox" name="delete" value="1" />
            </label>
            <button class="btn rounded-md bg-green-700 text-slate-50" type="submit">
                提交
            </button>
        </form>
    );
};

/** 用于显示 Tags 的相似指数 */
export const RelateTags = (props: {
    text: Atom<string>;
    onDataReturn?: (data: ITagData[]) => void;
    onClick?: (data: ITagData) => void;
}) => {
    const data = resource(() => TagAPI.searchTags(props.text(), true), {
        immediately: false,
        initValue: [],
        deps: [DebounceAtom(props.text, 300)],
    });
    useEffectWithoutFirst(() => {
        props.onDataReturn && props.onDataReturn(data());
    }, [data]);
    return (
        <ul class=" text-xs">
            <For each={data()} fallback={<div> 空</div>}>
                {(item) => {
                    return (
                        <li
                            class="flex cursor-pointer gap-1 hover:bg-slate-600"
                            onclick={() => props.onClick && props.onClick(item)}
                        >
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
