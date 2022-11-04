import { useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data } from './App';
import { stringToTags, TagsToString } from './use/TagsConvertor';
import { Notice } from './utils/notice';

export function HeaderFirst() {
    const { enMode, usersCollection, visibleId, lists, emphasizeSymbol } = useContext(Data);
    return (
        <header class="flex w-full border-b border-slate-700 pb-2 text-sm font-bold">
            <span class="btn" onclick={() => enMode((i) => !i)}>
                {enMode() ? '英文' : '中文'}
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
            <span class="btn" onclick={() => visibleId('setting')}>
                设置
            </span>
            <span class="btn bg-sky-800" onclick={() => visibleId('gallery')}>
                画廊
            </span>
            <span class="btn bg-sky-800" onclick={() => visibleId('uploader')}>
                分享
            </span>
            <span
                class="btn  scale-110 bg-purple-600 font-bold text-white"
                onClick={() => {
                    emphasizeSymbol((i) => (i === '{}' ? '()' : '{}'));
                    Notice.success('强调括号更换');
                }}
            >
                {emphasizeSymbol().split('').join(' ')}
            </span>
        </header>
    );
}
