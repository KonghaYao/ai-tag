import type { ITagData } from './App';
import { TagButton } from '../../components/TagButton';
import { Atom, reflect } from '@cn-ui/use';
import isMobile from 'is-mobile';
import { SortableList } from '@cn-ui/sortable';
import { HeaderFirst } from './ToolBar/HeaderFirst';
import { HeaderSecond } from './ToolBar/HeaderSecond';
import { useTagController } from '../../use/useTagController';
import { TagsToString, stringToTags } from '../../use/TagsConvertor';
import { Notice } from '../../utils/notice';
import { Message } from '../../components/MessageHInt';
import { DropReceiver, useDragAndDropData } from '@cn-ui/headless';
import tinykeys from 'tinykeys';
import { GlobalData } from '../../store/GlobalData';
import { useTranslation } from '../../i18n';
import type { Component } from 'solid-js';
export const BindHistoryKey = () => {
    const { redo, undo } = GlobalData.getApp('tag-control')!;

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
    const { usersCollection } = GlobalData.getApp('tag-control');

    const { t } = useTranslation();

    return (
        <section
            id="user-select-prompt"
            class="user-selected blur-background relative my-2 flex w-full flex-col overflow-visible rounded-xl border border-solid border-gray-600 bg-slate-900/20 p-2"
        >
            <HeaderFirst></HeaderFirst>
            <TagsRow usersCollection={usersCollection}></TagsRow>

            {usersCollection().length === 0 && (
                <span class=" whitespace-pre-wrap text-center font-light text-sky-500">
                    {t('userSelect.hint.add')}
                </span>
            )}
            <HeaderSecond></HeaderSecond>
        </section>
    );
};
export const TagsRow: Component<{ usersCollection: Atom<ITagData[]> }> = (props) => {
    const { usersCollection } = props;
    const { deleteMode, enMode, emphasizeAddMode, emphasizeSubMode, showLangInLine1 } =
        GlobalData.getApp('data');
    const { lists, TagsHistory, injectTags } = GlobalData.getApp('tag-control');
    const { wheelEvent, clickEvent } = useTagController({ usersCollection });

    const disabledSortable = reflect(() => {
        return isMobile() ? emphasizeAddMode() || emphasizeSubMode() || deleteMode() : false;
    });
    const { send } = useDragAndDropData();
    let breakCounter = 0;
    const { t } = useTranslation();

    const INPUT_MAGIC: any = (tags: string, _: DataTransfer, e: DragEvent) => {
        const old = usersCollection();

        let isCombine = e.ctrlKey;
        let isTailAdd = e.altKey;
        console.log(tags);
        const input = stringToTags(tags, lists());
        injectTags(old, input, isCombine, isTailAdd, usersCollection);
        /** @ts-ignore 往里面加一个 done 值，然后可以整个结构传递 */
        e.done = true;
        return false;
    };
    return (
        <DropReceiver
            detect={{
                ADD_BEFORE() {
                    Message.success(t('userSelect.message.addTail'));
                },
                INPUT_MAGIC(_, e: any) {
                    if (e.ctrlKey) {
                        Message.success(t('userSelect.message.combine'));
                    } else if (e.altKey) {
                        Message.success(t('userSelect.message.TailAdd'));
                    } else {
                        Message.success(t('userSelect.message.input'));
                    }
                },
            }}
            receive={{
                ADD_BEFORE(info) {
                    usersCollection((i) => [...i, ...stringToTags(info, lists())]);
                },
                INPUT_MAGIC,
                extra(_, dataTransfer, e) {
                    if ((e as any).ignore) return;
                    const text = dataTransfer && dataTransfer!.getData('text');
                    console.log('触发文字传递');
                    if (text) {
                        const old = usersCollection();
                        TagsHistory.addToHistory(TagsToString(old));
                        const input = stringToTags(text, lists());
                        injectTags(
                            old,
                            input,
                            (e as any).ctrlKey,
                            (e as any).altKey,
                            usersCollection
                        );
                    }
                },
            }}
        >
            <SortableList
                class="scroll-box flex flex-wrap gap-2 overflow-y-auto overflow-x-hidden p-2 text-sm"
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

                                            temp.splice(dist, 0, ...stringToTags(info, lists()));
                                            return temp;
                                        });
                                        Notice.success(t('success'));
                                    },
                                    INPUT_MAGIC,
                                }}
                            >
                                <TagButton
                                    data={item}
                                    en={enMode}
                                    cn={reflect(() => showLangInLine1() || !enMode())}
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
                                    // 暂时取消英文翻译
                                    // onMouseEnter={(item) => {
                                    //     item.count === Infinity && translate().translate(item.en);
                                    // }}
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
        </DropReceiver>
    );
};
