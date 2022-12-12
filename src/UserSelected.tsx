import { For, useContext } from 'solid-js';
import { Data, IData } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import isMobile from 'is-mobile';
import { SortableList } from '@cn-ui/sortable';
import { HeaderFirst } from './HeaderFirst';
import { HeaderSecond } from './HeaderSecond';
import { t } from 'i18next';
import { useTagController } from './use/useTagController';
import { stringToTags } from './use/TagsConvertor';
import { useDragAndDropData } from './use/useDragAndDropData';
import { Notice } from './utils/notice';
import { useHoverInDOM } from './use/useHoverInDom';
import { Message } from './MessageHint';
import { CombineMagic } from './utils/CombineMagic';
import { DropReceiver } from './components/DnD';

export const UserSelected = () => {
    const { deleteMode, enMode, usersCollection, emphasizeAddMode, emphasizeSubMode, lists } =
        useContext(Data);
    const { wheelEvent, clickEvent } = useTagController();

    const disabledSortable = reflect(() => {
        if (isMobile()) {
            // 修复移动端多重状态 BUG
            return emphasizeAddMode() || emphasizeSubMode() || deleteMode();
        } else {
            // 电脑端没有这个 BUG
            return false;
        }
    });
    const { send } = useDragAndDropData();
    return (
        <DropReceiver
            detect={{
                ADD_BEFORE() {
                    Message.success(t('userSelect.message.addTail'));
                },
                COMBINE_MAGIC() {
                    Message.success(t('userSelect.message.combine'));
                },
                INPUT_MAGIC() {
                    Message.success(t('userSelect.message.input'));
                },
            }}
            receive={{
                ADD_BEFORE(info) {
                    usersCollection((i) => [...i, ...stringToTags(info, lists())]);
                },
                COMBINE_MAGIC(tags: string) {
                    const input = stringToTags(tags, lists());
                    CombineMagic(input, usersCollection);
                    Message.success(t('publicPanel.hint.CombineSuccess'));
                },
                INPUT_MAGIC(tags: string) {
                    usersCollection(stringToTags(tags, lists()));
                    Notice.success(t('publicPanel.hint.CopySuccess'));
                },
            }}
        >
            <main class="user-selected my-2 flex w-full flex-col rounded-xl border border-solid border-gray-600 p-2 ">
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
                >
                    {(item) => {
                        return (
                            <div data-id={item.en}>
                                <DropReceiver
                                    detect={{
                                        ADD_BEFORE() {
                                            Message.success(t('userSelect.message.addBefore'));
                                        },
                                    }}
                                    receive={{
                                        ADD_BEFORE(info) {
                                            usersCollection((i) => {
                                                const temp = [...i];
                                                const dist = i.indexOf(item) ?? temp.length;

                                                temp.splice(
                                                    dist,
                                                    0,
                                                    ...stringToTags(info, lists())
                                                );
                                                return temp;
                                            });
                                            Notice.success(t('success'));
                                        },
                                    }}
                                >
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
                                </DropReceiver>
                            </div>
                        );
                    }}
                </SortableList>

                {usersCollection().length === 0 && (
                    <span class="h-16 whitespace-pre-wrap text-center font-light text-sky-500">
                        {t('userSelect.hint.add')}
                    </span>
                )}
                <HeaderSecond></HeaderSecond>
            </main>
        </DropReceiver>
    );
};
