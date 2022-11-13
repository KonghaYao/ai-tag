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
import { useHoverInDOM } from './use/useHoverInDom';
import { Message } from './MessageHint';

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
    const { events } = useHoverInDOM((type) => {
        if (type === 'Drag') {
            receive(false, 'ADD_BEFORE', () => {
                Message.success(t('userSelect.message.addBefore'));
            });
        }
    });
    return (
        <main
            class="user-selected my-2 flex w-full flex-col rounded-xl border border-solid border-gray-600 p-2 "
            ondragover={(e) => {
                e.preventDefault();
                receive(false, 'ADD_BEFORE', () => {
                    Message.success(t('userSelect.message.addTail'));
                });
            }}
            onDrop={(e) => {
                // 默认添加到末尾
                receive(e.dataTransfer, 'ADD_BEFORE', (info) => {
                    usersCollection((i) => [...i, ...stringToTags(info, lists())]);
                });
            }}
        >
            <HeaderFirst></HeaderFirst>
            <SortableList
                class="flex flex-wrap overflow-y-auto overflow-x-hidden text-sm"
                style={{
                    'max-height': '30vh',
                }}
                setData={(data, el) => {
                    // 向拖拽单位输入数据
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
                        <div data-id={item.en} {...events}>
                            <TagButton
                                onDrop={(item, data, e) => {
                                    e.stopPropagation();
                                    // 在某个元素前创建协议
                                    receive(data, 'ADD_BEFORE', (info) => {
                                        usersCollection((i) => {
                                            const temp = [...i];
                                            const dist = i.indexOf(item) ?? temp.length;

                                            temp.splice(dist, 0, ...stringToTags(info, lists()));
                                            return temp;
                                        });
                                        Notice.success(t('success'));
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
                <span class="h-16 whitespace-pre-wrap text-center font-light text-sky-500">
                    {t('userSelect.hint.add')}
                </span>
            )}
            <HeaderSecond></HeaderSecond>
        </main>
    );
};
