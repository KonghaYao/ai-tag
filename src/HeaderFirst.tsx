import { For, useContext } from 'solid-js';
import { Data } from './App';
import { breakSymbol, stringToTags } from './use/TagsConvertor';
import { Notice } from './utils/notice';
import { useTranslation } from '../i18n';
import { useWebView, WebViewLink } from './Panels/Webview';
import isMobile from 'is-mobile';
import { FloatPanel } from './components/FloatPanel';
import { LocalPower, MainGridOfInner } from './Panels/HomePanel';
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
                class="btn  bg-blue-700 font-bold  "
                onclick={() => {
                    nav('./notebook.html');
                }}
            >
                {iconBtn() ? 'book' : t('notebook')}
            </span>
            <ToolBox></ToolBox>
            <span
                class="btn font-icon bg-violet-700   text-sm "
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
export const ToolBox = () => {
    const { enMode, usersCollection, visibleId, lists, emphasizeSymbol, iconBtn } =
        useContext(Data);

    const { t } = useTranslation();
    return (
        <FloatPanel
            class="btn h-full bg-indigo-700"
            popup={
                <div class=" flex flex-col gap-2">
                    {/* 中英文切换符号 */}
                    <span class="btn bg-yellow-700 text-sm" onclick={() => enMode((i) => !i)}>
                        {iconBtn()
                            ? t('toolbar1.' + (enMode() ? 'en' : 'zh'))[0]
                            : t('toolbar1.' + (enMode() ? 'en' : 'zh'))}
                    </span>
                    <span
                        class="btn  bg-indigo-700   text-sm "
                        onClick={() => {
                            emphasizeSymbol((i) => (i === '{}' ? '()' : '{}'));
                            Notice.success(t('toolbar1.hint.bracketsChange'));
                        }}
                    >
                        {emphasizeSymbol().split('').join(' ')}
                    </span>
                </div>
            }
        >
            <span class="font-icon h-full w-full">build</span>
        </FloatPanel>
    );
};

/** 主页面板的直接展示，免得打开太麻烦 */
export const MainFloat = () => {
    const { visibleId, iconBtn } = useContext(Data);
    const { t } = useTranslation();

    return (
        <FloatPanel
            class="btn h-full bg-green-700"
            popup={
                <div class="flex flex-col gap-2">
                    <nav class="flex justify-end">
                        <div class="font-icon btn" onclick={() => visibleId('')}>
                            apps
                        </div>
                    </nav>
                    <div class="grid w-48 grid-cols-3 gap-2">
                        <MainGridOfInner></MainGridOfInner>
                    </div>
                </div>
            }
        >
            <span class="h-full w-full">{iconBtn() ? 'apps' : t('toolbar1.Home')}</span>
        </FloatPanel>
    );
};
