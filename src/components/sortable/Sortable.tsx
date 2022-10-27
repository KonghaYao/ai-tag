// Core SortableJS (without default plugins)
import {
    Accessor,
    createContext,
    createEffect,
    For,
    JSX,
    JSXElement,
    mergeProps,
    useContext,
} from 'solid-js';
import SortableCore from 'sortablejs';
import {
    OriginComponent,
    Atom,
    atomization,
    extendsEvent,
    atom,
    reflect,
    createIgnoreFirst,
} from '@cn-ui/use';
import { useSortable } from './useSortable';
export { SortableCore };
/** Sortable 组件的公共参数 */
export const SortableShared = createContext<{
    /** 当使用 sharedList 的时候进行数据的统一 */
    sharedData?: Atom<unknown[]>[];
    /** 默认参数 */
    options?: SortableCore.Options;
}>({});

/* TODO 还有很多示例未完成数据统一化 */

export interface SortableListProps<T> extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
    each: T[] | Atom<T[]>;
    fallback?: JSX.Element;
    /** 获取 each 中的元素的 id 的方法，默认获取 */
    getId?: (item: T) => string;
    children: (item: T, index: Accessor<number>) => JSXElement;
    options?: SortableCore.Options;
    void: T;
    disabled: Atom<boolean>;
}

/**
 * @zh 使用响应式对象操控可排序列表
 */
export const SortableList = OriginComponent<SortableListProps<unknown>>((baseProps) => {
    const context = useContext(SortableShared);
    const props = mergeProps(
        {
            options: context.options ?? {},
        },
        baseProps
    ) as unknown as SortableListProps<unknown>;
    const getId = props.getId || ((item) => (item as any).id.toString());
    const disabled = atomization(props.disabled);

    createIgnoreFirst(() => {
        const sortable = getSortable();
        sortable && sortable.option('disabled', disabled());
    }, [disabled]);
    const RefreshData = () => {
        const sortable = getSortable();
        each(() => {
            const groupData = context.sharedData?.flatMap((i) => i());
            return sortable.toArray().map((id) => {
                return groupData.find((item) => getId(item) === id);
            });
        });
    };
    const { initSort, getSortable } = useSortable({
        ...props.options,
        // sort: false,
        // delayOnTouchOnly: true, // only delay if user is using touch
        // delay: 100,

        onSort() {
            const sortable: string[] = getSortable()
                .toArray()
                .filter((i) => i !== getId(props.void));
            props.options?.onSort?.apply(this, arguments);
            // console.log(sortable);
            const update = () => {
                each((i) => {
                    return sortable.map((id) => {
                        return i.find((item) => getId(item) === id);
                    });
                });
            };
            update();
        },

        onAdd() {
            props.options?.onAdd?.apply(this, arguments);
            RefreshData();
        },
        onRemove() {
            props.options?.onRemove?.apply(this, arguments);
            RefreshData();
        },
    });
    const each = atomization(props.each);
    createEffect(() => {
        const sortable = getSortable();
        if (sortable) {
            const IdMap = each().map((i) => getId(i));
            if (sortable.toArray().join(',') !== IdMap.join(',')) {
                // console.log('外部导入', IdMap);
                sortable.sort(IdMap);
            }
        }
    });
    // fixed 把元素放置在末尾会发生 bug
    // 多添加一个空白的数据，让最后一个不能移动就行了
    return (
        <div
            ref={initSort}
            /** @ts-ignore */
            class={props.class()}
            style={props.style}
            {...extendsEvent(props)}
        >
            <For each={[...each(), props.void]} fallback={props.fallback}>
                {props.children}
            </For>
        </div>
    );
}) as unknown as <T>(props: SortableListProps<T>) => JSXElement;
