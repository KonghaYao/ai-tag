import { For, useContext } from 'solid-js';
import { Data, IData } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import isMobile from 'is-mobile';
import { SortableList } from './components/sortable';
import { HeaderFirst } from './HeaderFirst';
import { HeaderSecond } from './HeaderSecond';
import { t } from 'i18next';
import { useTagController } from './use/useTagController';

export const UserSelected = () => {
    const { deleteMode, enMode, usersCollection, emphasizeAddMode, emphasizeSubMode } =
        useContext(Data);
    const { wheelEvent, clickEvent } = useTagController();
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
                <span class="h-16 text-center  font-light text-sky-500">
                    {t('userSelect.hint.add')}
                </span>
            )}
            <HeaderSecond></HeaderSecond>
        </main>
    );
};
