import { Atom, atomization } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import { Component, useContext } from 'solid-js';
import { Data, IData } from '../App';
import { Notice } from '../utils/notice';

export const TagButton: Component<{
    data: IData;
    onClick?: (item: IData) => void;
    en?: Atom<boolean>;
    cn?: Atom<boolean>;
}> = (props) => {
    const { showCount, enMode } = useContext(Data);
    const en = atomization(props.en ?? true);
    const cn = atomization(props.cn ?? true);
    const item = props.data;
    const color = () => {
        if (item.count > 1000000) return 'bg-red-900';
        if (item.count > 100000) return 'bg-pink-900';
        if (item.count > 10000) return 'bg-amber-900';
        if (item.count > 1000) return 'bg-yellow-900';
        if (item.count > 500) return 'bg-green-900';
    };

    return (
        <nav
            class="text-col relative mx-2 my-2 flex  cursor-pointer select-none  rounded-md bg-gray-600 px-2 py-1 text-center transition-colors active:bg-gray-700"
            onclick={() => {
                props.onClick && props.onClick(item);
            }}
            onDblClick={() => {
                copy(enMode() ? item.en : item.cn);
                Notice.success('双击单项复制魔法释放');
            }}
        >
            <span>{Array(props.data.emphasize).fill('{')}</span>
            <div class="flex flex-col">
                {cn() && <div>{item.cn}</div>}
                {en() && <div>{item.en}</div>}
            </div>
            <span>{Array(props.data.emphasize).fill('}')}</span>
            {showCount() && (
                <div
                    class={
                        'pointer-events-none absolute -right-4 -top-2 rounded-lg bg-gray-700 px-1 text-xs font-thin text-gray-400 ' +
                        color()
                    }
                >
                    {item.count}
                </div>
            )}
        </nav>
    );
};
