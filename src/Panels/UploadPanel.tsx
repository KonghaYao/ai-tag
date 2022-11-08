import { createEffect, For, useContext, useTransition } from 'solid-js';
import { Data } from '../App';
import { createStore } from 'solid-js/store';
import { Panel, PanelContext } from '../components/Panel';
import { API, StoreData } from '../api/notion';
import { Atom, atom, useSingleAsync } from '@cn-ui/use';
import { Notice } from '../utils/notice';
import { TagsToString } from '../use/TagsConvertor';
import { batch } from 'solid-js';
import { readFileInfo } from '../utils/getPromptsFromPic';
import { untrack } from 'solid-js/web';
import { useTranslation } from '../../i18n';
const init = {
    username: '',
    tags: '',
    r18: true,
    image: '',
    description: '',
    seed: '',
    other: '',
} as StoreData;
const [store, set] = createStore({ ...init });

const useSharedUpload = (uploading: Atom<boolean>) => {
    const { t } = useTranslation();
    const { username } = useContext(Data);

    // 上传前检查
    const check = () => {
        if (store.description && username() && store.image && store.tags) {
            return true;
        }
        return false;
    };
    /** 上传接口 */
    const upload = useSingleAsync(() => {
        if (check()) {
            Notice.success(t('uploadPanel.hint.uploading'));
            return API.uploadData({ ...store, username: username() }).then(() => {
                set((i) => ({ ...i, image: '', description: '', seed: '' }));
                Notice.success(t('uploadPanel.hint.uploadDone'));
            });
        } else {
            Notice.error(t('uploadPanel.hint.checkError'));
        }
    });
    const uploadPicture = async (file: File) => {
        Notice.success(t('uploadPanel.hint.uploadingImage'));
        uploading(true);
        const fd = new FormData();
        fd.append('key', '0000239c0acbbcb3bdedc2b1c6983537');
        fd.append('media', file);
        return fetch('https://thumbsnap.com/api/upload', {
            method: 'post',
            body: fd,
        })
            .then((res) => res.json())
            .then((res) => {
                uploading(false);
                set('image', res.data.thumb);
                Notice.success(t('uploadPanel.hint.uploadDone'));
            })
            .catch((err) => {
                console.warn(err);
                Notice.error(t('uploadPanel.hint.uploadError'));
            });
    };
    return { upload, uploadPicture };
};

export const UploadPanel = () => {
    const { t } = useTranslation();
    const { isPanelVisible } = useContext(PanelContext);
    const { username, usersCollection, emphasizeSymbol } = useContext(Data);
    const uploading = atom(false);

    const { upload, uploadPicture } = useSharedUpload(uploading);

    createEffect(() => {
        if (isPanelVisible('uploader')) {
            const list = untrack(usersCollection);
            batch(() => {
                set('tags', TagsToString(list, emphasizeSymbol()));
            });
        }
    });
    /** 输入文件事件 */
    const changeFile = async (e: any) => {
        const file: File = e.target.files[0];
        const data = await readFileInfo(file).catch((error) => {
            console.warn(error);
            return [];
        });
        // console.log(data);
        const info = new Map(data);

        // 写入 tags
        if (info.has('Description')) {
            const tags = info.get('Description');
            batch(() => {
                set('tags', tags);
            });
        }
        // 看看是否有种子号
        const seed =
            info.get('Comment')?.seed?.toString() ?? file.name.match(/(?<=-)[\d]+(?=.+?$)/)?.[0];
        seed?.length && set('seed', seed);

        set('other', JSON.stringify(data));

        uploadPicture(file);
    };

    return (
        <Panel id="uploader">
            <header class="w-full py-2 text-center font-bold">{t('uploadPanel.title')}</header>

            <main class="flex flex-1 flex-col overflow-auto">
                <div class="my-2 mx-4 flex items-center justify-between">
                    <label class="flex-none ">{t('uploadPanel.YourName')}</label>
                    <input
                        placeholder="那菈的名字"
                        class="input ml-1 w-full"
                        type="text"
                        value={username()}
                        onChange={(e) => {
                            /**@ts-ignore */
                            username(e.target.value);
                        }}
                    />
                </div>
                <div class="my-2 mx-4 flex items-center justify-between">
                    <label class="flex-none ">{t('uploadPanel.description')}</label>
                    <input
                        placeholder="曲调名称"
                        class="input ml-1 w-full"
                        type="text"
                        value={store.description}
                        onChange={(e) => {
                            /** @ts-ignore */
                            set('description', e.target.value);
                        }}
                    />
                </div>
                <div
                    class="my-2 mx-4 flex items-center justify-between"
                    onclick={() => set('r18', !store.r18)}
                >
                    <label class="flex-none text-green-600">
                        {t('uploadPanel.suitableForTeen')}
                    </label>
                    <div
                        class="h-6 w-6 rounded-md border border-solid border-slate-600 transition-colors duration-300"
                        classList={{
                            'bg-blue-500': !store.r18,
                            'bg-gray-800': store.r18,
                        }}
                    ></div>
                </div>
                <div class="my-2 mx-4 text-center text-sm text-green-700">
                    {t('uploadPanel.hint1')}
                </div>
                <div class="my-2 mx-4 text-center text-sm text-green-700">
                    {t('uploadPanel.hint2')}
                </div>
                <div class="my-2 mx-4 flex items-center justify-between ">
                    <div class="flex-none">{t('uploadPanel.autoDetect')}</div>
                    <input type="file" oninput={changeFile} />
                </div>

                {uploading() && (
                    <div class="btn w-full text-center text-red-600 ">
                        {t('uploadPanel.hint.uploadingImage')}
                    </div>
                )}
                {store.image && (
                    <img
                        class="m-auto h-32 w-32 object-cover"
                        src={store.image}
                        alt=""
                        loading="lazy"
                    />
                )}
                <div class="my-2 mx-4 flex items-center justify-between">
                    <label class="flex-none ">{t('uploadPanel.prompt')}</label>
                    <textarea
                        placeholder="曲调内容"
                        class="input ml-1"
                        value={store.tags}
                        oninput={(e) => {
                            /** @ts-ignore */
                            const text = e.target.value;
                            set('tags', text);
                            console.log(text);
                        }}
                    />
                </div>
                <div class="my-2 mx-4 flex cursor-pointer flex-wrap">
                    {t('uploadPanel.DetectResult')}
                    {store.tags}
                </div>

                <div class="my-2 mx-4 flex items-center justify-between">
                    <label class="flex-none ">{t('uploadPanel.seed')}</label>
                    <input
                        placeholder="如果没有可以不填"
                        class="input ml-1 w-full"
                        type="text"
                        value={store.seed}
                        onChange={(e) => {
                            /**@ts-ignore */
                            set('seed', e.target.value);
                        }}
                    />
                </div>
                <a
                    class="px-2 text-sky-600"
                    target="_blank"
                    href="https://creativecommons.org/share-your-work/public-domain/cc0/"
                >
                    <div class="p-2 text-sm text-green-600">{t('uploadPanel.license')}</div>
                </a>
            </main>
            <div class="cursor-pointer bg-green-600 p-2  text-center text-white" onClick={upload}>
                {t('uploadPanel.hint.commit')}{' '}
                <span class="text-xs">{t('uploadPanel.hint.commitHint')}</span>
            </div>
        </Panel>
    );
};
