import { batch, useContext } from 'solid-js';
import { useTranslation } from '../../../i18n';

import { CopyBtn } from './sub/CopyBtn';
import { GlobalData } from '../../../store/GlobalData';

export function HeaderSecond() {
    const { emphasizeAddMode, emphasizeSubMode, deleteMode } = GlobalData.getApp('data');
    const { visibleId } = GlobalData.getApp('side-app');
    const { usersCollection } = GlobalData.getApp('tag-control');
    const { t } = useTranslation();

    return (
        <header class="flex gap-2 border-t border-slate-700 pt-2 text-sm font-bold text-neutral-300">
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
                {t('toolbar2.subWeight')}
            </span>

            <CopyBtn></CopyBtn>
            <span class="btn cursor-default" title="Tag 个数">
                {usersCollection().length}
            </span>
            <span
                class="btn"
                onClick={() => {
                    visibleId('ai-prompt');
                }}
                title="AI 助手"
            >
                🤗{'AI'}
            </span>
        </header>
    );
}
