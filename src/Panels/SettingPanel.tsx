import { For, useContext } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { Notice } from '../utils/notice';

export const SettingPanel = () => {
    const { r18Mode, showCount, tagsPerPage, sideAppMode, MaxEmphasize, defaultFont } =
        useContext(Data);

    const { t } = useTranslation();
    const list = [
        { title: t('settingPanel.lists.teen'), bind: r18Mode.reflux(!r18Mode(), (i) => !i) },
        { title: t('settingPanel.lists.number'), bind: showCount },
        { title: t('settingPanel.lists.sideAPP'), bind: sideAppMode },
        { title: t('settingPanel.lists.defaultFont'), bind: defaultFont },
    ];
    const NumberList = [
        { title: t('settingPanel.lists.everyTimeTags'), bind: tagsPerPage },
        { title: t('settingPanel.lists.maxEm'), bind: MaxEmphasize },
    ];
    const reloadCache = async () => {
        await fetch('https://cdn.jsdelivr.net/gh/konghayao/tag-collection/data/tags.csv', {
            cache: 'reload',
        }).then(() => {
            Notice.success(t('settingPanel.hint.updated'));
        });
    };
    return (
        <Panel id="setting">
            <h3 class="my-2 text-center text-lg font-bold">{t('settingPanel.title')}</h3>
            <div class="bg-slate-700 p-2 text-center transition-colors" onclick={reloadCache}>
                {t('settingPanel.hint.refresh')}
            </div>
            <For each={list}>
                {(item) => {
                    return (
                        <nav
                            class="mx-4 my-2 flex justify-between"
                            onClick={() => {
                                item.bind((i) => !i);
                            }}
                        >
                            <label>{item.title}</label>
                            <div
                                class="h-6 w-6 rounded-md border border-solid border-slate-700 transition-colors duration-300"
                                classList={{
                                    'bg-blue-500': item.bind(),
                                    'bg-gray-800': !item.bind(),
                                }}
                            ></div>
                        </nav>
                    );
                }}
            </For>
            <For each={NumberList}>
                {(item) => {
                    return (
                        <nav class="mx-4 my-2 flex justify-between">
                            <label>{item.title}</label>
                            <input
                                class="w-32 appearance-none rounded-md border border-solid border-gray-600 bg-gray-800 px-6 text-center text-gray-500 outline-none"
                                value={item.bind()}
                                type="number"
                                min={0}
                                onChange={(e) => {
                                    /** @ts-ignore */
                                    item.bind(parseInt(e.target.value));
                                }}
                            />
                        </nav>
                    );
                }}
            </For>
            <div class="flex-1"></div>
        </Panel>
    );
};
