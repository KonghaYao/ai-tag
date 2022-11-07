import { For, useContext } from 'solid-js';
import { Data, IData } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import isMobile from 'is-mobile';
import { SortableList } from './components/sortable';
import { HeaderFirst } from './HeaderFirst';
import { HeaderSecond } from './HeaderSecond';
import { useIframeExpose } from './iframeExpose';
import { plus, minus } from 'number-precision';
import { debounce } from 'lodash-es';
export const UserSelected = () => {
    const {
        deleteMode,
        enMode,
        usersCollection,
        emphasizeAddMode,
        emphasizeSubMode,
        MaxEmphasize,
    } = useContext(Data);

    useIframeExpose();

    const clickEvent = (item: IData, rightClick?: boolean) => {
        deleteMode() && usersCollection((i) => i.filter((it) => it !== item));

        if ((emphasizeAddMode() && !rightClick) || (rightClick && emphasizeSubMode())) {
            // 加权操作

            return usersCollection((arr) => {
                const index = arr.findIndex((it) => it === item);
                const it = arr[index];
                const newArr = [...arr];
                if (it.weight) {
                    newArr[index] = { ...it, weight: plus(it.weight, 1).toString() };
                    return newArr;
                } else if (it.emphasize < MaxEmphasize()) {
                    newArr[index] = { ...it, emphasize: it.emphasize + 1 };
                    return newArr;
                }
                return arr;
            });
        }
        if ((emphasizeSubMode() && !rightClick) || (rightClick && emphasizeAddMode())) {
            // 减权操作
            return usersCollection((arr) => {
                const index = arr.findIndex((it) => it === item);
                const it = arr[index];
                const newArr = [...arr];
                if (it.weight) {
                    const weight = minus(it.weight, 1);
                    newArr[index] = { ...it, weight: weight < 0 ? '0.0' : weight.toString() };
                    return newArr;
                } else if (it.emphasize > -1 * MaxEmphasize()) {
                    newArr[index] = { ...it, emphasize: it.emphasize - 1 };
                    return newArr;
                }
                return arr;
            });
        }
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
    const wheelEvent = debounce((item: IData, delta: number) => {
        const diff = delta / 150;
        if (emphasizeAddMode() || emphasizeSubMode()) {
            // console.log(diff);
            if (diff > 0) {
                return usersCollection((arr) => {
                    const index = arr.findIndex((it) => it === item);
                    const it = arr[index];
                    const newArr = [...arr];
                    const weight = plus(it.weight, 0.1);
                    newArr[index] = { ...it, weight: weight < 0 ? '0.0' : weight.toString() };
                    return newArr;
                });
            } else {
                // 减权操作
                return usersCollection((arr) => {
                    const index = arr.findIndex((it) => it === item);
                    const it = arr[index];
                    const newArr = [...arr];

                    const weight = minus(it.weight, 0.1);
                    newArr[index] = { ...it, weight: weight < 0 ? '0.0' : weight.toString() };
                    return newArr;
                });
            }
        }
    }, 50);
    return (
        <main class="user-selected my-2 flex w-full flex-col rounded-xl border border-solid border-gray-600 p-2 ">
            <HeaderFirst></HeaderFirst>
            <SortableList
                class="flex flex-wrap overflow-y-auto overflow-x-hidden text-sm"
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
                                onWheel={(info, delta, e) => {
                                    e.preventDefault();
                                    wheelEvent(info, delta);
                                }}
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
