import { batch, For, useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data, IData } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import isMobile from 'is-mobile';
import { stringToTags, TagsToString } from './use/TagsToString';
import { Notice } from './utils/notice';
import { SortableList } from './components/sortable';
export const UserSelected = () => {
    const { deleteMode, enMode, usersCollection, emphasizeAddMode, emphasizeSubMode } =
        useContext(Data);
    const clickEvent = (item: IData) => {
        deleteMode() && usersCollection((i) => i.filter((it) => it !== item));
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
                if (it.emphasize > -5) {
                    const newArr = [...arr];
                    newArr[index] = { ...it, emphasize: it.emphasize - 1 };
                    return newArr;
                }
                return arr;
            });
    };
    const voidId = Math.random().toString();
    const disabledSortable = reflect(() => {
        if (isMobile()) {
            // 修复移动端多重状态 BUG
            return emphasizeAddMode() || emphasizeSubMode() || deleteMode();
        } else {
            // 电脑端没有这个 BUG
            return false;
        }
    });
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
                options={{}}
                disabled={disabledSortable}
                void={
                    {
                        en: voidId,
                        cn: '',
                        r18: 0,
                        emphasize: 0,
                        count: 0,
                    } as IData
                }
            >
                {(item) => {
                    if (item.en === voidId) return <div data-id={item.en}></div>;
                    return (
                        <div data-id={item.en}>
                            <TagButton
                                data={item}
                                en={enMode}
                                cn={reflect(() => !enMode())}
                                onClick={clickEvent}
                            ></TagButton>
                        </div>
                    );
                }}
            </SortableList>
            {/* <span class="text-xs text-red-600">拖拽移动到最后一个的位置上会 BUG</span> */}

            {usersCollection().length === 0 && (
                <span class="h-16 text-center  font-light text-sky-500">点击下面的关键词添加</span>
            )}
            <HeaderSecond></HeaderSecond>
        </main>
    );
};

function HeaderFirst() {
    const { enMode, usersCollection, visibleId } = useContext(Data);
    return (
        <header class="flex w-full border-b border-slate-700 pb-2 text-sm font-bold">
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

            <span class="btn" onclick={() => visibleId('setting')}>
                设置
            </span>
            <span class="btn bg-sky-800" onclick={() => visibleId('gallery')}>
                画廊
            </span>
            <span class="btn bg-sky-800" onclick={() => visibleId('uploader')}>
                分享
            </span>
        </header>
    );
}

function HeaderSecond() {
    const { r18Mode, emphasizeAddMode, emphasizeSubMode, deleteMode, usersCollection, lists } =
        useContext(Data);
    return (
        <header class="flex border-t border-slate-700 pt-2 text-sm font-bold">
            <span
                class="btn"
                classList={{
                    'bg-gray-700 border-gray-800': deleteMode(),
                }}
                onclick={() =>
                    batch(() => {
                        emphasizeAddMode(false);
                        emphasizeSubMode(false);
                        deleteMode((i) => !i);
                    })
                }
            >
                删除模式
            </span>
            <span
                class="btn"
                classList={{
                    'bg-gray-700 border-gray-800': emphasizeAddMode(),
                }}
                onClick={() =>
                    batch(() => {
                        deleteMode(false);
                        emphasizeSubMode(false);
                        emphasizeAddMode((i) => !i);
                    })
                }
            >
                加权模式
            </span>
            <span
                class="btn"
                classList={{
                    'bg-gray-700 border-gray-800': emphasizeSubMode(),
                }}
                onClick={() =>
                    batch(() => {
                        deleteMode(false);
                        emphasizeAddMode(false);
                        emphasizeSubMode((i) => !i);
                        console.log(emphasizeSubMode());
                    })
                }
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
        </header>
    );
}
