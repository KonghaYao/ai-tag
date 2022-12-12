import copy from 'copy-to-clipboard';
import { batch, useContext } from 'solid-js';
import { useTranslation } from '../i18n';
import { Data } from './App';
import { DragPoster } from '@cn-ui/headless';
import { TagsToString } from './use/TagsConvertor';
import { Notice } from './utils/notice';

export function HeaderSecond() {
    const {
        enMode,
        emphasizeAddMode,
        emphasizeSubMode,
        deleteMode,
        usersCollection,
        emphasizeSymbol,
        iconBtn,
    } = useContext(Data);
    const { t } = useTranslation();
    const getTagString = () => {
        return TagsToString(
            usersCollection().map((i) => {
                // 中英文模式下的不同修改
                if (enMode()) {
                    return i;
                } else {
                    return { ...i, text: i.cn };
                }
            }),
            emphasizeSymbol()
        );
    };
    return (
        <header
            class="flex border-t border-slate-700 pt-2 font-bold text-neutral-300"
            classList={{
                'font-icon': iconBtn(),
                'text-lg': iconBtn(),
                'text-sm': !iconBtn(),
            }}
        >
            <span
                class="btn"
                classList={{
                    'bg-red-800 border-gray-800': deleteMode(),
                }}
                onclick={() =>
                    batch(() => {
                        emphasizeAddMode(false);
                        emphasizeSubMode(false);
                        deleteMode((i) => !i);
                    })
                }
            >
                {iconBtn() ? 'delete' : t('toolbar2.deleteMode')}
            </span>
            <span
                class="btn"
                classList={{
                    'bg-amber-800 border-gray-800': emphasizeAddMode(),
                }}
                onClick={() =>
                    batch(() => {
                        deleteMode(false);
                        emphasizeSubMode(false);
                        emphasizeAddMode((i) => !i);
                    })
                }
            >
                {iconBtn() ? 'text_increase' : t('toolbar2.addWeight')}
            </span>
            <span
                class="btn"
                classList={{
                    'bg-sky-800 border-gray-800': emphasizeSubMode(),
                }}
                onClick={() =>
                    batch(() => {
                        deleteMode(false);
                        emphasizeAddMode(false);
                        emphasizeSubMode((i) => !i);
                    })
                }
            >
                {iconBtn() ? 'text_decrease' : t('toolbar2.subWeight')}
            </span>

            <DragPoster
                send={(send) => send('PURE_TAGS', getTagString())}
                text={() => getTagString()}
            >
                <span
                    class="btn"
                    onclick={() => {
                        copy(getTagString());
                        Notice.success(t('toolbar2.hint.copy'));
                    }}
                    title={t('toolbar2.hint.copy_drag')}
                >
                    {iconBtn() ? 'copy' : t('toolbar2.copy')}
                </span>
            </DragPoster>
        </header>
    );
}
