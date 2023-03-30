import { createStore } from 'solid-js/store';
import { API, StoreData } from '../api/notion';
import { Atom, asyncLock, atom } from '@cn-ui/use';
import { Notice } from '../utils/notice';
import { batch } from 'solid-js';
import { readFileInfo } from '../utils/getPromptsFromPic';
import { useTranslation } from '../i18n';
import { UploadButton } from '../components/UploadButton';

const init = {
    username: '',
    tags: '',
    r18: true,
    image: '',
    description: '',
    seed: '',
    other: '',
    size: '',
} as StoreData;
const [store, set] = createStore({ ...init });
import ImageKit from 'imagekit-javascript';
import md5 from 'md5';
import { GlobalData } from '../store/GlobalData';
const imagekit = new ImageKit({
    publicKey: 'public_49Srlf9AEpmrR1xMPR7Gh2JafbU=',
    urlEndpoint: 'https://ik.imagekit.io/dfidfiskkxn/',
    /** @ts-ignore */
    authenticationEndpoint: new URL('/.netlify/functions/upload_auth', location),
});

const useSharedUpload = (uploading: Atom<boolean>, username: Atom<string>) => {
    const { t } = useTranslation();

    // 上传前检查
    const check = () => {
        if (store.description && username() && store.image && store.tags) {
            return true;
        }
        return false;
    };
    /** 上传接口 */
    const upload = asyncLock(() => {
        if (check()) {
            Notice.success(t('uploadPanel.hint.uploading'));
            // backupRemoteImage(store.image);
            return API.uploadData({ ...store, username: username() }).then(() => {
                set((i) => ({ ...i, image: '', description: '', seed: '', tags: '' }));
                Notice.success(t('uploadPanel.hint.uploadDone'));
            });
        } else {
            Notice.error(t('uploadPanel.hint.checkError'));
        }
    });
    const uploadPicture = async (file: File) => {
        Notice.success(t('uploadPanel.hint.uploadingImage'));
        uploading(true);
        return imagekit
            .upload({
                file: file as any,
                fileName: file.name,
                folder: 'save',
                useUniqueFileName: false,
                overwriteFile: false,
            })
            .then((res) => {
                // TODO 解决上传重复文件报错问题
                uploading(false);

                set('image', res.url);
                Notice.success(t('uploadPanel.hint.uploadPicDone'));
            })
            .catch((err) => {
                console.warn(err);
                if (err.message.startsWith('A file with the same name already')) {
                    set('image', `https://ik.imagekit.io/dfidfiskkxn/save/${file.name}`);
                } else {
                    Notice.error(t('uploadPanel.hint.uploadError'));
                }
                uploading(false);
            });
    };
    return { upload, uploadPicture };
};
export const getImageSize = async (file: File) => {
    const url = URL.createObjectURL(file);
    return new Promise<string>((res) => {
        const image = new Image();
        image.onload = () => {
            const { width, height } = image;
            res(`${width}x${height}`);
        };
        image.src = url;
    }).finally(() => {
        URL.revokeObjectURL(url);
    });
};
export const UploadPanel = () => {
    const { t } = useTranslation();
    const { username } = GlobalData.getApp('data');
    const uploading = atom(false);

    const { upload, uploadPicture } = useSharedUpload(uploading, username);

    /** 输入文件事件 */
    const changeFile = async (files: FileList) => {
        const buffer = await files[0].arrayBuffer();
        const id = md5(new Uint8Array(buffer));
        const file = new File([files[0]], id);
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
        const size = await getImageSize(file);
        set('size', size);
        console.log(data);

        uploadPicture(file);
    };
    return (
        <section
            class="flex h-full max-w-xl flex-col"
            ondragover={(e) => {
                e.preventDefault();
            }}
            ondrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer) {
                    const getFile = [...e.dataTransfer.files].filter((i) =>
                        i.type.startsWith('image/')
                    ) as any as FileList;
                    changeFile(getFile);
                }
            }}
        >
            <header class="w-full py-2 text-center font-bold">{t('uploadPanel.title')}</header>

            <main class="mx-4 flex flex-1 flex-col gap-4 overflow-auto ">
                <div class="rounded-md bg-slate-700 p-2 text-xs">
                    上传的图片将会在 画廊 进行展示，感谢您的分享！
                </div>
                <div class=" flex items-center justify-between">
                    <sup class="text-xl text-red-600">*</sup>
                    <label class="flex-none ">{t('uploadPanel.YourName')}</label>
                    <input
                        placeholder={t('uploadPanel.YourName')}
                        class="input ml-1 w-full"
                        type="text"
                        value={username()}
                        onChange={(e) => {
                            /**@ts-ignore */
                            username(e.target.value);
                        }}
                    />
                </div>
                <div class=" flex items-center justify-between">
                    <label class="flex-none ">
                        <sup class="text-xl text-red-600">*</sup>
                        {t('uploadPanel.description')}
                    </label>
                    <input
                        placeholder="这张图片的描述"
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
                    class=" flex items-center justify-between"
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

                <div class=" flex items-center justify-between ">
                    <div class="flex-none">
                        <sup class="text-xl text-red-600">*</sup> {t('uploadPanel.autoDetect')}
                    </div>
                    <UploadButton accept="image/*" onUpload={changeFile}>
                        {t('upload')}
                    </UploadButton>
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

                <nav class="flex-1"></nav>
                <aside class="rounded-md bg-slate-700 p-2 text-xs">{t('uploadPanel.hint2')}</aside>
                <a
                    class="w-full text-sky-600"
                    target="_blank"
                    href="https://creativecommons.org/share-your-work/public-domain/cc0/"
                >
                    <div class="w-full rounded-md bg-slate-700 p-2 text-xs">
                        {t('uploadPanel.license')}
                    </div>
                </a>
                <aside class="w-full rounded-md bg-slate-700 p-2 text-xs text-rose-500">
                    {t('uploadPanel.notice')}
                </aside>
            </main>
            <button
                class="cursor-pointer bg-green-600 p-2  text-center text-white"
                onClick={upload}
            >
                {t('uploadPanel.hint.commit')}
                <span class="text-xs">{t('uploadPanel.hint.commitHint')}</span>
            </button>
        </section>
    );
};
