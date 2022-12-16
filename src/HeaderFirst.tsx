import { For, useContext } from 'solid-js';
import { Data } from './App';
import { stringToTags } from './use/TagsConvertor';
import { Notice } from './utils/notice';
import { useTranslation } from '../i18n';
import { useWebView, WebViewLink } from './Panels/Webview';
import isMobile from 'is-mobile';
import { FloatPanel } from './components/FloatPanel';
import { LocalPower } from './Panels/HomePanel';
export function HeaderFirst() {
    const { enMode, usersCollection, visibleId, lists, emphasizeSymbol, iconBtn } =
        useContext(Data);
    const { nav } = useWebView();
    const { t } = useTranslation();
    return (
        <header
            class="flex w-full whitespace-nowrap border-b border-slate-700 pb-2  font-bold text-neutral-300"
            classList={{
                'font-icon': iconBtn(),
                'text-xl': iconBtn(),
                'text-sm': !iconBtn(),
            }}
        >
            <span class="btn bg-yellow-700 text-sm" onclick={() => enMode((i) => !i)}>
                {iconBtn()
                    ? t('toolbar1.' + (enMode() ? 'en' : 'zh'))[0]
                    : t('toolbar1.' + (enMode() ? 'en' : 'zh'))}
            </span>
            <div
                class="btn bg-lime-700"
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
            <MainFloat></MainFloat>
            <span class="btn bg-teal-700" onclick={() => visibleId('gallery')}>
                {iconBtn() ? 'collections' : t('toolbar1.Gallery')}
            </span>
            {!isMobile() && (
                <span class="btn bg-sky-700" onclick={() => visibleId('uploader')}>
                    {iconBtn() ? 'upload' : t('toolbar1.Share')}
                </span>
            )}
            <span
                class="btn  bg-indigo-700   text-sm "
                onClick={() => {
                    emphasizeSymbol((i) => (i === '{}' ? '()' : '{}'));
                    Notice.success(t('toolbar1.hint.bracketsChange'));
                }}
            >
                {emphasizeSymbol().split('').join(' ')}
            </span>
            <span
                class="btn  bg-purple-700 font-bold  "
                onclick={() => {
                    nav('./notebook.html');
                }}
            >
                {iconBtn() ? 'book' : t('notebook')}
            </span>
        </header>
    );
}
export const MainFloat = () => {
    const { visibleId, iconBtn } = useContext(Data);
    const { t } = useTranslation();

    return (
        <FloatPanel
            class="btn h-full bg-green-700"
            popup={
                <div class="grid w-48 grid-cols-3 gap-2">
                    <For each={LocalPower}>
                        {(item, index) => {
                            return (
                                <div
                                    class="flex cursor-pointer flex-col items-center justify-center bg-slate-800 hover:bg-slate-700"
                                    style={{
                                        color: `hwb(${index() * 20}deg 9% 21%)`,
                                    }}
                                    onclick={() => {
                                        visibleId(item.src);
                                    }}
                                >
                                    <div class="font-icon text-xl">{item.icon}</div>
                                    <span class="text-sm ">{item.name}</span>
                                </div>
                            );
                        }}
                    </For>
                </div>
            }
        >
            <span class="h-full w-full" onclick={() => visibleId('')}>
                {iconBtn() ? 'apps' : t('toolbar1.Home')}
            </span>
        </FloatPanel>
    );
};
