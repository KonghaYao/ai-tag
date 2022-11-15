import { useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data } from './App';
import { stringToTags, TagsToString } from './use/TagsConvertor';
import { Notice } from './utils/notice';
import { useTranslation } from '../i18n';
import { WebViewLink } from './Panels/Webview';
import isMobile from 'is-mobile';
export function HeaderFirst() {
    const { enMode, usersCollection, visibleId, lists, emphasizeSymbol } = useContext(Data);
    const { t } = useTranslation();
    return (
        <header class="flex w-full whitespace-nowrap border-b border-slate-700 pb-2 text-sm font-bold text-yellow-600">
            <span class="btn" onclick={() => enMode((i) => !i)}>
                {t('toolbar1.' + (enMode() ? 'en' : 'zh'))}
            </span>
            <div
                class="btn"
                onclick={() => {
                    const text = prompt(t('toolbar1.hint.ImportHint'), '');
                    console.log(text);
                    if (text) {
                        usersCollection(stringToTags(text, lists()));
                    }
                }}
            >
                {t('toolbar1.Import')}
            </div>
            <span class="btn" onclick={() => visibleId('')}>
                {t('toolbar1.Home')}
            </span>
            <span class="btn bg-sky-800" onclick={() => visibleId('gallery')}>
                {t('toolbar1.Gallery')}
            </span>
            {!isMobile() && (
                <span class="btn bg-sky-800" onclick={() => visibleId('uploader')}>
                    {t('toolbar1.Share')}
                </span>
            )}
            <span
                class="btn  bg-purple-600 font-bold  text-white"
                onClick={() => {
                    emphasizeSymbol((i) => (i === '{}' ? '()' : '{}'));
                    Notice.success(t('toolbar1.hint.bracketsChange'));
                }}
            >
                {emphasizeSymbol().split('').join(' ')}
            </span>
            <WebViewLink href="./notebook.html">
                <span class="btn  bg-purple-600 font-bold  text-white">{t('notebook')}</span>
            </WebViewLink>
        </header>
    );
}
