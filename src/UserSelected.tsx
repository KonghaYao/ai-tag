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
import { stringToTags } from './use/TagsConvertor';
import { useDragAndDropData } from './use/useDragAndDropData';
import { Notice } from './utils/notice';

export const UserSelected = () => {
    const { deleteMode, enMode, usersCollection, emphasizeAddMode, emphasizeSubMode, lists } =
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
    const { receive, send } = useDragAndDropData();
    return (
        <main class="user-selected my-2 flex w-full flex-col rounded-xl border border-solid border-gray-600 p-2 ">
            <HeaderFirst></HeaderFirst>
            <SortableList
                class="flex flex-wrap overflow-y-auto overflow-x-hidden text-sm"
                style={{
                    'max-height': '30vh',
                }}
                setData={(data, el) => {
                    const item = usersCollection().find((i) => i.en === el.dataset.id);
                    item && send(data, { type: 'USER_SELECTED', data: item });
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
                                onDrop={(item, data) => {
                                    // 接收创建协议
                                    receive(data, 'ADD_BEFORE', (info) => {
                                        usersCollection((i) => {
                                            const temp = [...i];
                                            const dist = i.indexOf(item) ?? temp.length;

                                            temp.splice(dist, 0, ...stringToTags(info, lists()));
                                            return temp;
                                        });
                                        Notice.success('添加成功');
                                    });
                                }}
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
