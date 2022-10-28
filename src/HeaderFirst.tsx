import { useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data } from './App';
import { TagsToString } from './use/TagsToString';
import { Notice } from './utils/notice';

export function HeaderFirst() {
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
