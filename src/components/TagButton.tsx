import { Atom, atomization, reflect } from '@cn-ui/use';
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
    const emColor = [
        'bg-purple-700',
        'bg-indigo-700',
        'bg-blue-700',
        'bg-sky-700',
        'bg-cyan-700',
        //0
        'bg-gray-700',
        'bg-lime-800',
        'bg-yellow-800',
        'bg-amber-800',
        'bg-orange-800',
        'bg-red-800',
    ];
    const em = reflect(() => emColor[props.data.emphasize + 5]);
    const split = reflect(() => {
        const count = Math.abs(props.data.emphasize);

        const splitSymbol = props.data.emphasize > 0 ? '{}' : '[]';
        return [
            Array(count).fill(splitSymbol[0]).join(''),
            Array(count).fill(splitSymbol[1]).join(''),
        ];
    });
    return (
        <nav
            class="text-col relative mx-2 my-2 flex  cursor-pointer select-none  rounded-md  px-2 py-1 text-center transition-colors active:brightness-90"
            onClick={() => {
                props.onClick && props.onClick(item);
            }}
            classList={{ [em()]: true }}
            onDblClick={() => {
                copy(enMode() ? item.en : item.cn);
                Notice.success('双击单项复制魔法释放');
            }}
            data-id={item.en}
        >
            <span>{split()[0]}</span>
            <div class="flex flex-col">
                {cn() && <div>{item.cn}</div>}
                {en() && <div>{item.en}</div>}
            </div>
            <span>{split()[1]}</span>
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
