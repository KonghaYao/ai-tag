import { For, useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import { SortableList } from '@cn-ui/sortable';
export const UserSelected = () => {
    const { deleteMode, enMode, usersCollection } = useContext(Data);
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
                            }}
                        ></TagButton>
                    );
                }}
            </SortableList>

            {usersCollection().length === 0 && (
                <span class="text-sm font-light">点击下面的关键词添加</span>
            )}
            <HeaderSecond></HeaderSecond>
        </main>
    );
};

function HeaderFirst() {
    const { deleteMode, enMode, usersCollection, settingVisible, publicVisible } = useContext(Data);
    return (
        <header class="flex w-full  py-2 text-sm font-bold">
            <span
                class="btn"
                classList={{
                    'bg-gray-700 border-gray-800': deleteMode(),
                }}
                onclick={() => deleteMode((i) => !i)}
            >
                删除模式
            </span>
            <span class="btn" onclick={() => enMode((i) => !i)}>
                {enMode() ? '英文' : '中文'}
            </span>
            <span
                class="btn"
                onclick={() => {
                    const en = enMode();
                    copy(
                        usersCollection()
                            .map((item) => {
                                return en ? item.en : item.cn;
                            })
                            .join(',')
                    );
                }}
            >
                一键复制
            </span>

            <span class="btn" onclick={() => settingVisible((i) => !i)}>
                设置
            </span>
            <span class="btn bg-green-800" onclick={() => publicVisible((i) => !i)}>
                广场
            </span>
        </header>
    );
}

function HeaderSecond() {
    const { r18Mode } = useContext(Data);
    return (
        <header class="flex py-2  text-sm font-bold">
            <span
                class="btn"
                classList={
                    {
                        // 'bg-gray-700 border-gray-800': deleteMode(),
                    }
                }
            >
                删除模式
            </span>
            {r18Mode() && <span class="btn">青少年模式</span>}
        </header>
    );
}
