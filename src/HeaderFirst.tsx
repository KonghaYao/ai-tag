import { useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Data } from './App';
import { stringToTags, TagsToString } from './use/TagsConvertor';
import { Notice } from './utils/notice';
import { useTranslation } from '../i18n';
import { useWebView, WebViewLink } from './Panels/Webview';
import isMobile from 'is-mobile';
export function HeaderFirst() {
    const { enMode, usersCollection, visibleId, lists, emphasizeSymbol, iconBtn } =
        useContext(Data);
    const { nav } = useWebView();
    const { t } = useTranslation();
    return (
        <header
            class="flex w-full whitespace-nowrap border-b border-slate-700 pb-2  font-bold text-yellow-600"
            classList={{
                'font-icon': iconBtn(),
                'text-xl': iconBtn(),
                'text-sm': !iconBtn(),
            }}
        >
            <span class="btn text-sm" onclick={() => enMode((i) => !i)}>
                {iconBtn()
                    ? t('toolbar1.' + (enMode() ? 'en' : 'zh'))[0]
                    : t('toolbar1.' + (enMode() ? 'en' : 'zh'))}
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
                {iconBtn() ? 'add_circle' : t('toolbar1.Import')}
            </div>
            <span class="btn " onclick={() => visibleId('')}>
                {iconBtn() ? 'apps' : t('toolbar1.Home')}
            </span>
            <span class="btn bg-sky-800" onclick={() => visibleId('gallery')}>
                {iconBtn() ? 'collections' : t('toolbar1.Gallery')}
            </span>
            {!isMobile() && (
                <span class="btn bg-sky-800" onclick={() => visibleId('uploader')}>
                    {iconBtn() ? 'present_to_all' : t('toolbar1.Share')}
                </span>
            )}
            <span
                class="btn  bg-purple-600   text-sm text-white"
                onClick={() => {
                    emphasizeSymbol((i) => (i === '{}' ? '()' : '{}'));
                    Notice.success(t('toolbar1.hint.bracketsChange'));
                }}
            >
                {emphasizeSymbol().split('').join(' ')}
            </span>
            <span
                class="btn  bg-purple-600 font-bold  text-white"
                onclick={() => {
                    nav('./notebook.html');
                }}
            >
                {iconBtn() ? 'book' : t('notebook')}
            </span>
        </header>
    );
}
