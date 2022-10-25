import { For, useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import { SortableList } from '@cn-ui/sortable';
import { stringToTags, TagsToString } from './use/TagsToString';
import { Notice } from './utils/notice';
export const UserSelected = () => {
    const { deleteMode, enMode, usersCollection, emphasizeAddMode, emphasizeSubMode } =
        useContext(Data);
    return (
        <main class="my-2 flex w-full flex-col rounded-xl border border-solid border-gray-600 p-2">
            <HeaderFirst></HeaderFirst>
            <SortableList
                class="flex flex-wrap overflow-y-auto overflow-x-hidden  text-sm"
                style={{
                    'max-height': '30vh',
                }}
                each={usersCollection}
                getId={(el) => el.en}
            >
                {(item) => {
                    return (
                        <TagButton
                            data={item}
                            en={enMode}
                            cn={reflect(() => !enMode())}
                            onClick={(item) => {
                                deleteMode() &&
                                    usersCollection((i) => i.filter((it) => it !== item));
                                emphasizeAddMode() &&
                                    usersCollection((arr) => {
                                        const index = arr.findIndex((it) => it === item);
                                        const it = arr[index];
                                        if (it.emphasize < 5) {
                                            const newArr = [...arr];
                                            newArr[index] = { ...it, emphasize: it.emphasize + 1 };
                                            return newArr;
                                        }
                                        return arr;
                                    });
                                emphasizeSubMode() &&
                                    usersCollection((arr) => {
                                        const index = arr.findIndex((it) => it === item);
                                        const it = arr[index];
                                        if (it.emphasize > 0) {
                                            const newArr = [...arr];
                                            newArr[index] = { ...it, emphasize: it.emphasize - 1 };
                                            return newArr;
                                        }
                                        return arr;
                                    });
                            }}
                        ></TagButton>
                    );
                }}
            </SortableList>
            <span class="text-xs text-red-600">拖拽移动到最后一个的位置上会 BUG</span>

            {usersCollection().length === 0 && (
                <span class="text-sm font-light">点击下面的关键词添加</span>
            )}
            <HeaderSecond></HeaderSecond>
        </main>
    );
};

function HeaderFirst() {
    const { enMode, usersCollection, settingVisible, publicVisible, uploaderVisible } =
        useContext(Data);
    return (
        <header class="flex w-full  py-2 text-sm font-bold">
            <span class="btn" onclick={() => enMode((i) => !i)}>
                {enMode() ? '英文' : '中文'}
            </span>
            <span
                class="btn"
                onclick={() => {
                    const en = enMode();
                    copy(TagsToString(usersCollection(), en));
                    Notice.success('复制魔法释放');
                }}
            >
                一键复制
            </span>

            <span class="btn" onclick={() => settingVisible((i) => !i)}>
                设置
            </span>
            <span class="btn bg-green-800" onclick={() => publicVisible(true)}>
                模板资源
            </span>
            <span class="btn bg-green-800" onclick={() => uploaderVisible(true)}>
                我要分享
            </span>
        </header>
    );
}

function HeaderSecond() {
    const { r18Mode, emphasizeAddMode, emphasizeSubMode, deleteMode, usersCollection, lists } =
        useContext(Data);
    return (
        <header class="flex py-2  text-sm font-bold">
            <span
                class="btn"
                classList={{
                    'bg-gray-700 border-gray-800': deleteMode(),
                }}
                onclick={() => {
                    emphasizeAddMode(false);
                    emphasizeAddMode(false);
                    deleteMode((i) => !i);
                }}
            >
                删除模式
            </span>
            <span
                class="btn"
                classList={{
                    'bg-gray-700 border-gray-800': emphasizeAddMode(),
                }}
                onClick={() => {
                    deleteMode(false);
                    emphasizeSubMode(false);
                    emphasizeAddMode((i) => !i);
                }}
            >
                加权模式
            </span>
            <span
                class="btn"
                classList={{
                    'bg-gray-700 border-gray-800': emphasizeSubMode(),
                }}
                onClick={() => {
                    deleteMode(false);
                    emphasizeAddMode(false);
                    emphasizeSubMode((i) => !i);
                }}
            >
                减权模式
            </span>
            <div
                class="btn"
                onclick={() => {
                    const text = prompt('请输入魔咒, 魔咒将会覆盖哦', '');
                    console.log(text);
                    if (text) {
                        usersCollection(stringToTags(text, lists()));
                    }
                }}
            >
                魔咒导入
            </div>
            {!r18Mode() && <span class="btn">青少年模式</span>}
        </header>
    );
}
