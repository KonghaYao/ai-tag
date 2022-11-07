import copy from 'copy-to-clipboard';
import { batch, useContext } from 'solid-js';
import { useTranslation } from '../i18n';
import { Data } from './App';
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
    } = useContext(Data);
    const { t } = useTranslation();
    return (
        <header class="flex border-t border-slate-700 pt-2 text-sm font-bold text-yellow-600">
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
                {t('toolbar2.deleteMode')}
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
                {t('toolbar2.addWeight')}
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
                {t('toolbar2.addWeight')}
            </span>

            <span
                class="btn"
                onclick={() => {
                    copy(
                        TagsToString(
                            usersCollection().map((i) => {
                                if (enMode()) {
                                    return i;
                                } else {
                                    return { ...i, text: i.cn };
                                }
                            }),
                            emphasizeSymbol()
                        )
                    );
                    Notice.success(t('toolbar2.hint.copy'));
                }}
            >
                {t('toolbar2.copy')}
            </span>
        </header>
    );
}
