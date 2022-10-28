import { batch, useContext } from 'solid-js';
import { Data } from './App';
import { stringToTags } from './use/TagsToString';

export function HeaderSecond() {
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
