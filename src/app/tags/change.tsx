import { Tab, Tabs } from '@cn-ui/core';

export const TagsChangePage = () => {
    return (
        <section>
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
    return (
        <form class="flex flex-col gap-2">
            <h3 class="text-xl">增加 Tag</h3>
            <blockquote>请根据英文构造 Tag，填写下面表单并提交即可</blockquote>
            <label>
                <span>英文名称</span>
                <input type="text" name="en" />
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
                <input type="checkbox" name="r18" />
            </label>
        </form>
    );
};

/** 用于显示 Tags 的相似指数 */
export const RelateTags = () => {
    return;
};
