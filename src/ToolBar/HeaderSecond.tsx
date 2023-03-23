import { batch, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../app/main/App';
import { CopyBtn } from './sub/CopyBtn';

export function HeaderSecond() {
    const { emphasizeAddMode, emphasizeSubMode, visibleId, deleteMode, iconBtn, usersCollection } =
        GlobalData.getApp('data');
    const { t } = useTranslation();

    return (
        <header
            class="flex gap-2 border-t border-slate-700 pt-2 font-bold text-neutral-300"
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
