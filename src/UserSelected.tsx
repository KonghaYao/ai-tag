import { useContext } from 'solid-js';
import { Data } from './App';
import { TagButton } from './components/TagButton';
import { reflect } from '@cn-ui/use';
import isMobile from 'is-mobile';
import { SortableList } from '@cn-ui/sortable';
import { HeaderFirst } from './ToolBar/HeaderFirst';
import { HeaderSecond } from './ToolBar/HeaderSecond';
import { t } from 'i18next';
import { useTagController } from './use/useTagController';
import { TagsToString, stringToTags } from './use/TagsConvertor';
import { Notice } from './utils/notice';
import { Message } from './MessageHint';
import { CombineMagic } from './utils/CombineMagic';
import { DropReceiver, useDragAndDropData } from '@cn-ui/headless';
import tinykeys from 'tinykeys';
export const BindHistoryKey = () => {
    const { redo, undo } = useContext(Data);

    tinykeys(window, {
        '$mod+KeyZ': (event) => {
            event.preventDefault();
            undo();
        },
        '$mod+KeyY': (event) => {
            event.preventDefault();
            redo();
        },
    });
};

export const UserSelected = () => {
    const {
        deleteMode,
        enMode,
        usersCollection,
        emphasizeAddMode,
        emphasizeSubMode,
        lists,
        TagsHistory,
    } = useContext(Data);
    const { wheelEvent, clickEvent } = useTagController();
    BindHistoryKey();
    const disabledSortable = reflect(() => {
        return isMobile() ? emphasizeAddMode() || emphasizeSubMode() || deleteMode() : false;
    });
    const { send } = useDragAndDropData();
    let breakCounter = 0;

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
                    TagsHistory.addToHistory(TagsToString(usersCollection()));
                    const input = stringToTags(tags, lists());
                    CombineMagic(input, usersCollection);
                    Message.success(t('publicPanel.hint.CombineSuccess'));
                },
                INPUT_MAGIC(tags: string) {
                    TagsHistory.addToHistory(TagsToString(usersCollection()));
                    usersCollection(stringToTags(tags, lists()));
                    Notice.success(t('publicPanel.hint.CopySuccess'));
                    return false;
                },
                extra(_, dataTransfer: DataTransfer) {
                    const text = dataTransfer.getData('text');
                    if (text) {
                        TagsHistory.addToHistory(TagsToString(usersCollection()));
                        usersCollection(stringToTags(text, lists()));
                    }
                },
            }}
        >
            <main class="user-selected  my-2 flex w-full flex-col rounded-xl border border-solid border-gray-600 p-2 ">
                <HeaderFirst></HeaderFirst>
                <SortableList
                    class="scroll-box flex flex-wrap overflow-y-auto overflow-x-hidden text-sm"
                    style={{
                        'max-height': '40vh',
                        'min-height': '10vh',
                    }}
                    setData={(data, el) => {
                        // 向拖拽单位输入数据
                        const item = usersCollection().find((i) => i.en === el.dataset.id);
                        item && send(data, { type: 'USER_SELECTED', data: item });
                    }}
                    each={usersCollection}
                    options={{}}
                    disabled={disabledSortable}
                >
                    {(item) => {
                        const id = item.text === '\n' ? `\n${breakCounter++}` : item.en;
                        // 强行装入一个副作用
                        (item as any).id = id;
                        return (
                            <div
                                data-id={id}
                                classList={{
                                    ['basis-full']: item.text === '\n',
                                }}
                            >
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
                                        onClick={
                                            item.text === '\n'
                                                ? () => {
                                                      deleteMode() &&
                                                          usersCollection((i) =>
                                                              i.filter((it) => it !== item)
                                                          );
                                                  }
                                                : clickEvent
                                        }
                                        onWheel={(info, delta, e) => {
                                            e.preventDefault();
                                            // console.log('onWheel');
                                            wheelEvent(info, delta);
                                        }}
                                    ></TagButton>
                                </DropReceiver>
                            </div>
                        );
                    }}
                </SortableList>

                {usersCollection().length === 0 && (
                    <span class=" whitespace-pre-wrap text-center font-light text-sky-500">
                        {t('userSelect.hint.add')}
                    </span>
                )}
                <HeaderSecond></HeaderSecond>
            </main>
        </DropReceiver>
    );
};
