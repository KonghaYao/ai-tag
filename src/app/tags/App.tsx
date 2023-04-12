import { GlobalHeader } from '../main/GlobalHeader';

export const TagsManager = () => {
    return (
        <section class=" text-slate-50">
            <GlobalHeader title="Tag 编辑器"></GlobalHeader>
            <blockquote>
                这里是 魔导绪论的 Tag 编辑器，任何人可以在这里对整个系统的 Tag 进行操作。
            </blockquote>
            <h2 class="my-2 text-xl">规则列表</h2>
            <ol class="my-2 rounded-xl bg-green-800 p-4">
                <li>所有操作将会进行检查，检查后将会更新，大概每天都会检查，第二天即可看到 </li>
                <li>不建议再添加 R18 等违禁词汇，因为效率不高 </li>
            </ol>
        </section>
    );
};
