import { Show, useContext } from 'solid-js';
import { Data } from '../app/main/App';
import { breakSymbol, stringToTags } from '../use/TagsConvertor';
import { Notice } from '../utils/notice';
import { useTranslation } from '../../i18n';
import { useWebView } from '../Panels/Webview';
import isMobile from 'is-mobile';
import { MainFloat } from './sub/MainFloat';
import { ToolBox } from './sub/ToolBox';
import { ToolBarColor } from './ColorJar';
export function HeaderFirst() {
    const { r18Mode, usersCollection, visibleId, lists, iconBtn } = GlobalData.getApp('data');
    const { nav } = useWebView();
    const { t } = useTranslation();
    return (
        <header
            class="flex w-full gap-2 whitespace-nowrap border-b border-slate-700 pb-2  font-bold text-neutral-300"
            classList={{
                'font-icon': iconBtn(),
                'text-xl': iconBtn(),
                'text-sm': !iconBtn(),
            }}
        >
            <span
                class={'btn ' + ToolBarColor.pick(0)}
                onclick={() => {
                    const text = prompt(t('toolbar1.hint.ImportHint'), '');
                    console.log(text);
                    if (text) {
                        usersCollection(stringToTags(text, lists()));
                    }
                }}
            >
                {iconBtn() ? 'add_circle' : t('toolbar1.Import')}
            </span>
            <MainFloat></MainFloat>
            <span
                class={'btn ' + ToolBarColor.pick(2)}
                onclick={() => nav('./gallery.html#/?r18=' + (r18Mode() ? 'true' : ''))}
            >
                {iconBtn() ? 'collections' : t('toolbar1.Gallery')}
            </span>

            <Show when={!isMobile()}>
                <span class={'btn ' + ToolBarColor.pick(3)} onclick={() => visibleId('uploader')}>
                    {iconBtn() ? 'upload' : t('toolbar1.Share')}
                </span>
                <span
                    class={'btn ' + ToolBarColor.pick(4)}
                    onclick={() => nav('https://cn.bing.com/translator/')}
                >
                    {iconBtn() ? 'translation' : '翻译'}
                </span>
            </Show>

            <span
                class={'btn font-bold ' + ToolBarColor.pick(5)}
                onclick={() => {
                    nav('./notebook.html');
                }}
            >
                {iconBtn() ? 'book' : t('notebook')}
            </span>
            <ToolBox></ToolBox>
            <span
                class={'btn font-icon text-sm ' + ToolBarColor.pick()}
                onClick={() => {
                    usersCollection((i) => [...i, { ...breakSymbol }]);
                    Notice.success(t('toolbar1.hint.addBreakLine'));
                }}
                title="添加分隔符到末尾"
            >
                mediation
            </span>
        </header>
    );
}
