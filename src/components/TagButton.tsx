import { Atom, atomization, reflect } from '@cn-ui/use';
import copy from 'copy-to-clipboard';
import { Accessor, Component, For, useContext } from 'solid-js';
import type { ITagData } from '../app/main/App';
import { Notice } from '../utils/notice';
import { GlobalData } from '../store/GlobalData';

/** 正向颜色 */
export const emColor = [
    'bg-lime-800',
    'bg-yellow-800',
    'bg-amber-800',
    'bg-orange-800',
    'bg-red-800',
] as const;
/** 反向颜色 */
export const _emColor = [
    'bg-cyan-700',
    'bg-sky-700',
    'bg-blue-700',
    'bg-indigo-700',
    'bg-purple-700',
] as const;

const useColorStep = (data: Accessor<number>) => {
    return {
        color: () => {
            const count = data();
            if (count > 1000000) return 'bg-red-900';
            if (count > 100000) return 'bg-pink-900';
            if (count > 10000) return 'bg-amber-900';
            if (count > 1000) return 'bg-yellow-900';
            if (count > 500) return 'bg-green-900';
        },
    };
};

export const TagButton: Component<{
    data: ITagData;
    onClick?: (item: ITagData, rightClick?: boolean) => void;
    onMouseEnter?(item: ITagData): void;
    onWheel?: (item: ITagData, delta: number, e: Event) => void;
    onDragStart?: (item: ITagData, dragData: DataTransfer, e: Event) => void;
    onDrop?: (item: ITagData, dropData: DataTransfer, e: Event) => void;
    draggable?: boolean;
    en?: Atom<boolean>;
    cn?: Atom<boolean>;
}> = (props) => {
    const { showCount, enMode, MaxEmphasize, emphasizeSymbol } = GlobalData.getApp('data')!;
    const en = atomization(props.en ?? true);
    const cn = atomization(props.cn ?? true);
    const item = props.data;
    // 强调颜色
    const { color } = useColorStep(() => item.count);

    const em = reflect(() => {
        if (props.data.emphasize === 0) return 'bg-slate-700';
        const index = Math.floor((Math.abs(props.data.emphasize) * 4) / MaxEmphasize());
        return (props.data.emphasize > 0 ? emColor : _emColor)[index];
    });

    // 强调括号
    const split = reflect(() => {
        const count = Math.abs(props.data.emphasize ?? 0);
        const [left, right] = props.data.emphasize > 0 ? emphasizeSymbol() : '[]';
        return [Array(count).fill(left).join(''), Array(count).fill(right).join('')];
    });

    const contentFormat = createContent(item, cn, en);

    return (
        <nav
            class="tag-button text-col relative  flex cursor-pointer select-none items-center gap-1 rounded-md    px-2 py-1 text-center transition-colors active:brightness-90 "
            onContextMenu={(e) => {
                e.preventDefault();
                props.onClick && props.onClick(item, true);
            }}
            onClick={() => {
                props.onClick && props.onClick(item, false);
            }}
            classList={{ [em()]: true }}
            onDblClick={() => {
                copy(enMode() ? item.en : item.cn);
                Notice.success('双击单项复制魔法释放');
            }}
            onWheel={(e) => {
                /**@ts-ignore */
                const delta: number = e.wheelDelta || e.detail;
                props.onWheel &&
                    (item.alternatingArr || item.weight || item.fromTo) &&
                    props.onWheel(item, delta, e);
                return false;
            }}
            draggable={props.draggable ?? false}
            ondragstart={(e) => {
                props.onDragStart && props.onDragStart(item, e.dataTransfer!, e);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                //阻止文件打开默认行为
                e.preventDefault();
                props.onDrop && props.onDrop(item, e.dataTransfer!, e);
            }}
            onmouseenter={() => props.onMouseEnter && props.onMouseEnter(item)}
            data-id={item.en}
        >
            <nav>{split()[0]}</nav>
            <main class="flex flex-col">{contentFormat()}</main>
            <nav>{split()[1]}</nav>
            {showCount() && item.count >= 0 && item.count !== Infinity && (
                <div
                    class={
                        ' pointer-events-none absolute -right-4 -top-2 rounded-lg px-1  text-xs   font-thin text-gray-400 ' +
                        color()
                    }
                >
                    {item.count}
                </div>
            )}
        </nav>
    );
};
/** 写出文本操作 */
function createContent(item: ITagData, cn: Atom<boolean>, en: Atom<boolean>) {
    return () => {
        if (item.alternatingArr && item.alternatingArr.length)
            return (
                <div class="special-tags flex gap-1">
                    [
                    <For each={item.alternatingArr}>
                        {(item, index) => (
                            <>
                                {index() !== 0 && '|'}
                                <div>{item}</div>
                            </>
                        )}
                    </For>
                    ]
                </div>
            );
        if (item.fromTo && item.weight)
            return (
                <div class="special-tags flex gap-1">
                    [{item.fromTo[0] === '' ? item.fromTo[1] : item.fromTo.join(':')} :
                    <span class="text-purple-500">{item.weight}</span>]
                </div>
            );
        if (item.weight) {
            // console.log(item.weight);
            return (
                <div class="special-tags flex gap-1">
                    {`(${item.en}:`}
                    <span class="text-purple-500">{item.weight}</span>
                    {')'}
                </div>
            );
        }
        return (
            <>
                {cn() && (!en() || (en() && item.cn !== item.en)) && <div>{item.cn}</div>}
                {en() && <div class="en-words">{item.en}</div>}
            </>
        );
    };
}
