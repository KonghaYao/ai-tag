import { Setter, useContext } from 'solid-js';
import debounce from 'lodash-es/debounce';
import { Data } from '../App';
import { stringToTags } from '../use/TagsConvertor';
import { useTranslation } from '../../i18n';
import { Notice } from '../utils/notice';
import { Message } from '../MessageHint';
import { DropReceiver } from '@cn-ui/headless';
import { TradToSimple } from '../utils/TradToSimple';

export const SearchBar = () => {
    const { usersCollection, lists, searchText, iconBtn } = useContext(Data);
    const triggerSearch = debounce(searchText, 200);
    const { t } = useTranslation();
    const addToList = () => {
        const name = searchText();
        usersCollection((i) => [...i, ...stringToTags(name, lists())]);
        searchText('');
    };
    return (
        <nav class="flex w-full items-center gap-2">
            <input
                class="input my-2 flex-1"
                type="search"
                value={searchText()}
                placeholder={t('searchBox.hint.searchPlaceholder')}
                oninput={(e: any) => {
                    triggerSearch(e.target.value);
                }}
                onkeydown={(e) => {
                    if (e.code === 'Enter' && searchText()) addToList();
                }}
            ></input>

            <div
                class="flex gap-2"
                classList={{
                    'font-icon': iconBtn(),
                }}
            >
                <DropReceiver
                    detect={{
                        USER_SELECTED() {
                            Message.warn(t('searchBox.hint.deleteMessage'));
                        },
                    }}
                    receive={{
                        USER_SELECTED(item) {
                            usersCollection((i) => i.filter((i) => i.en !== item.en));
                            Notice.success(t('success'));
                        },
                    }}
                >
                    <div
                        class="btn flex-none bg-rose-700 px-4 text-slate-200"
                        onclick={() => triggerSearch('')}
                        title={t('searchBox.hint.deleteHint')}
                    >
                        {iconBtn() ? 'clear' : t('clear')}
                    </div>
                </DropReceiver>
                <span class="btn flex-none" onclick={addToList}>
                    {iconBtn() ? 'create' : t('searchBox.create')}
                </span>
            </div>
        </nav>
    );
};
