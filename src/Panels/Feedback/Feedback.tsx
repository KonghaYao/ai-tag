import { atom, asyncLock } from '@cn-ui/use';
import { For, useContext } from 'solid-js';
import i18n, { useTranslation } from '../../i18n';
import { Notice } from '../../utils/notice';
import { commitFeedBack, FeedBackMessage, Labels } from './index';
import { GlobalData } from '../../store/GlobalData';
export const FeedBackPanel = () => {
    const { t } = useTranslation();
    const { username } = GlobalData.getApp('data');
    const { visibleId } = GlobalData.getApp('side-app');
    /** 反馈信息 */
    const callbacks = atom<FeedBackMessage>({
        author: username(),
        title: '',
        labels: ['ADD_WORDS', 'bot'],
        body: '',
    });
    const checks = () => {
        const form = callbacks();
        return form.title && form.body ? true : false;
    };
    /** 提交请求 */
    const Commit = asyncLock(() => {
        if (checks()) {
            const form = callbacks();
            Notice.success(t('feedback.hint.uploading'));
            callbacks((i) => ({
                ...i,
                title: '',
                body: '',
            }));
            return commitFeedBack(form).then((res) => {
                const data = JSON.parse(localStorage.getItem('__my_feedback__') ?? '[]');
                data.push({
                    ...form,
                    url: res.html_url,
                });
                localStorage.setItem('__my_feedback__', JSON.stringify(data));
                Notice.success(t('feedback.hint.success'));
            });
        } else Notice.error(t('feedback.hint.notFilled'));
    });
    return (
        <>
            <h3 class="my-2 text-center text-lg font-bold">{t('feedback.feedbackMessage')}</h3>
            <div class="flex flex-col gap-2 p-4">
                <div
                    class="cursor-pointer border border-dashed border-green-800 py-2 text-center text-white transition-colors hover:bg-gray-800"
                    onClick={() => visibleId('my-feedback')}
                >
                    {t('feedback.viewOldFeedback')}
                </div>

                <div class="p-2 text-sm ">
                    <p>{t('feedback.beforeFeedback')}</p>
                    <p>{t('feedback.callbackTime')}</p>
                </div>
                <div class="flex justify-between">
                    <span class="flex-none">{t('feedback.IWantTo')}</span>
                    <select
                        value={callbacks().labels[0]}
                        class="ml-2 w-full appearance-none bg-gray-800 px-2 text-sm outline-none"
                        onChange={(e: any) => {
                            callbacks((i) => ({
                                ...i,
                                /** @ts-ignore */
                                labels: [e.target.value, 'bot'],
                            }));
                        }}
                    >
                        <For each={Labels}>
                            {(item) => {
                                return (
                                    <option value={item.value}>
                                        {i18n.language === 'zh-CN' ? item.name : item.value}
                                    </option>
                                );
                            }}
                        </For>
                    </select>
                </div>
                <div class="flex ">
                    <span class="flex-none">{t('feedback.QuestionTitle')}</span>
                    <input
                        placeholder={t('feedback.necessary')}
                        value={callbacks().title}
                        class="ml-4 w-full appearance-none rounded-md bg-gray-800 px-2 text-sm outline-none placeholder:text-gray-600"
                        onChange={(e: any) => {
                            callbacks((i) => ({
                                ...i,
                                title: e.target.value,
                            }));
                        }}
                    ></input>
                </div>
                <div class="flex ">
                    <span class="flex-none">{t('feedback.YourName')}</span>
                    <input
                        placeholder={t('feedback.Path')}
                        value={username()}
                        class="ml-4 w-full appearance-none rounded-md bg-gray-800 px-2 text-sm outline-none placeholder:text-gray-600"
                        onChange={(e: any) => {
                            callbacks((i) => ({
                                ...i,
                                author: e.target.value,
                            }));
                        }}
                    ></input>
                </div>
                <div>
                    {t('feedback.DescriptionTitle')}
                    <textarea
                        value={callbacks().body}
                        placeholder={t('feedback.Description')}
                        class="w-full appearance-none rounded-md bg-gray-800 px-2 text-sm outline-none placeholder:text-gray-600"
                        onChange={(e: any) => {
                            callbacks((i) => ({
                                ...i,
                                body: e.target.value,
                            }));
                        }}
                    ></textarea>
                </div>
            </div>
            <div class="flex-1"></div>
            <div
                class="cursor-pointer bg-green-700 p-2 text-center font-bold text-white"
                onclick={Commit}
            >
                {t('feedback.UploadButton')}
            </div>
        </>
    );
};
