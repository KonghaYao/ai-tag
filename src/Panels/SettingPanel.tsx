import { For } from 'solid-js';
import { useTranslation } from '../i18n';
import { UploadButton } from '../components/UploadButton';
import { GlobalData } from '../store/GlobalData';

export const SettingPanel = () => {
    const { backgroundImage, r18Mode, showCount, tagsPerPage, MaxEmphasize, defaultFont, iconBtn } =
        GlobalData.getApp('data');
    const { sideAppMode } = GlobalData.getApp('side-app');

    const { t } = useTranslation();
    // 在这里可以批量添加 bool 类型的变量
    const list = [
        {
            title: t('settingPanel.lists.teen'),
            bind: r18Mode.reflux(!r18Mode(), (i: boolean) => !i),
        },
        { title: t('settingPanel.lists.number'), bind: showCount },
        { title: t('settingPanel.lists.sideAPP'), bind: sideAppMode },
    ];
    const NumberList = [{ title: t('settingPanel.lists.maxEm'), bind: MaxEmphasize }];

    return (
        <>
            <h3 class="my-2 text-center text-lg font-bold">{t('settingPanel.title')}</h3>

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

            <nav class="mx-4 my-2 flex justify-between">
                <div class="flex w-full justify-between">
                    <div>{t('settingPanel.lists.backgroundImage')}</div>
                    <button
                        class="btn"
                        onClick={() => {
                            const url = prompt(t('settingPanel.hint.pleaseInput'));
                            if (url) {
                                backgroundImage(url);
                            }
                        }}
                    >
                        URL
                    </button>
                </div>
                <UploadButton
                    accept="image/*"
                    onUpload={([file]) => {
                        if (file) {
                            new Promise<string>((res) => {
                                let oFileReader = new FileReader();
                                oFileReader.onloadend = function (e) {
                                    res(e.target!.result as string);
                                };
                                oFileReader.readAsDataURL(file);
                            }).then((res) => {
                                backgroundImage(res);
                            });
                        }
                    }}
                >
                    {t('settingPanel.lists.localUpload')}
                </UploadButton>
                <button class="btn" onclick={() => backgroundImage('')}>
                    {t('clear')}
                </button>
            </nav>

            <div class="flex-1"></div>
        </>
    );
};
