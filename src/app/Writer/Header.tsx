import isMobile from 'is-mobile';
import { Show } from 'solid-js';
import { useWebView } from '../../Panels/Webview';
import { useTranslation } from '../../i18n';
import { GlobalData } from '../../store/GlobalData';
import { ToolBarColor } from '../main/ToolBar/ColorJar';
import { MainFloat } from '../main/ToolBar/sub/MainFloat';

export const Header = () => {
    const { r18Mode } = GlobalData.getApp('data');
    const { visibleId } = GlobalData.getApp('side-app');
    const { nav } = useWebView();
    const { t } = useTranslation();
    return (
        <header class="my-2 flex w-full items-center justify-center gap-4">
            <MainFloat></MainFloat>
            <span
                class={'btn ' + ToolBarColor.pick(2)}
                onclick={() => nav('/gallery?r18=' + (r18Mode() ? 'true' : ''))}
            >
                {t('toolbar1.Gallery')}
            </span>

            <Show when={!isMobile()}>
                <span class={'btn ' + ToolBarColor.pick(3)} onclick={() => visibleId('uploader')}>
                    {t('toolbar1.Share')}
                </span>
                <span
                    class={'btn ' + ToolBarColor.pick(4)}
                    onclick={() => nav('https://cn.bing.com/translator/')}
                >
                    {'翻译'}
                </span>
            </Show>

            <span
                class={'btn font-bold ' + ToolBarColor.pick(5)}
                onclick={() => {
                    nav('./notebook.html');
                }}
            >
                {t('notebook')}
            </span>
        </header>
    );
};
