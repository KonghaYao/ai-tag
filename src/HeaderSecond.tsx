import copy from 'copy-to-clipboard';
import { batch, useContext } from 'solid-js';
import { Data } from './App';
import { stringToTags, TagsToString } from './use/TagsToString';
import { Notice } from './utils/notice';

export function HeaderSecond() {
    const { enMode, emphasizeAddMode, emphasizeSubMode, deleteMode, usersCollection, lists } =
        useContext(Data);
    return (
        <header class="flex border-t border-slate-700 pt-2 text-sm font-bold">
            <span
                class="btn"
                classList={{
                    'bg-red-800 border-gray-800': deleteMode(),
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
                    'bg-amber-800 border-gray-800': emphasizeAddMode(),
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
                    'bg-sky-800 border-gray-800': emphasizeSubMode(),
                }}
                onClick={() =>
                    batch(() => {
                        deleteMode(false);
                        emphasizeAddMode(false);
                        emphasizeSubMode((i) => !i);
                    })
                }
            >
                减权模式
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
        </header>
    );
}
