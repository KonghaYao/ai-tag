import { createEffect, For, useContext } from 'solid-js';
import { Data } from '../App';
import { createStore } from 'solid-js/store';
import { Panel } from '../components/Panel';
import { API, StoreData } from '../api/notion';
import { Atom, atom, useSingleAsync } from '@cn-ui/use';
import { stringToTags } from '../utils/stringToTags';
import { Notice } from '../utils/notice';
import { TagsToString } from '../use/TagsToString';
import { batch } from 'solid-js';
const init = {
    username: '',
    tags: [],
    r18: true,
    image: '',
    description: '',
    origin_tags: '',
    seed: '',
} as StoreData;
const [store, set] = createStore({ ...init });

const useSharedUpload = (uploading: Atom<boolean>) => {
    const { username, usersCollection, isPanelVisible } = useContext(Data);

    // 上传前检查
    const check = () => {
        if (store.description && username() && store.image && store.origin_tags) {
            return true;
        }
        return false;
    };
    /** 上传接口 */
    const upload = useSingleAsync(() => {
        if (check()) {
            Notice.success('上传中，请稍等');
            return API.uploadData({ ...store, username: username() }).then(() => {
                set((i) => ({ ...i, image: '', description: '', seed: '' }));
                Notice.success('上传完成');
            });
        } else {
            Notice.error('你的法力好像有些缺失呀！');
        }
    });
    const uploadPicture = async (file: File) => {
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
            });
    };
    return { upload, uploadPicture };
};

export const UploadPanel = () => {
    const { username, usersCollection, isPanelVisible } = useContext(Data);
    const uploading = atom(false);

    const { upload, uploadPicture } = useSharedUpload(uploading);

    createEffect(() => {
        if (isPanelVisible('uploader')) {
            const list = usersCollection();
            batch(() => {
                set(
                    'tags',
                    list.map((i) => i.en)
                );
                set('origin_tags', TagsToString(list));
            });
        }
    });
    return (
        <Panel id="uploader">
            <header class="w-full py-2 text-center font-bold">大梦的曲调</header>

            <main class="flex flex-1 flex-col overflow-auto">
                <div class="my-2 mx-4 flex items-center justify-between">
                    <label class="flex-none ">你的名字</label>
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
                    <label class="flex-none ">魔咒描述</label>
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

                <div class="my-2 mx-4 flex items-center justify-between">
                    <label class="flex-none ">魔咒文本</label>
                    <textarea
                        placeholder="曲调内容"
                        class="input ml-1"
                        value={store.tags}
                        oninput={(e) => {
                            /** @ts-ignore */
                            const text = e.target.value;
                            set('tags', stringToTags(text));
                            set('origin_tags', text);
                        }}
                    />
                </div>
                <div class="my-2 mx-4 flex cursor-pointer flex-wrap">
                    检测结果：
                    <For each={store.tags}>
                        {(item) => <span class="m-1 rounded-lg bg-blue-800 px-1">{item}</span>}
                    </For>
                </div>

                <div class="my-2 mx-4 text-center text-sm text-green-700">
                    注意上传正确的图片和 tag 否则会被清理
                </div>
                <div class="my-2 mx-4 flex items-center justify-between ">
                    <div class="flex-none">必须要有图片</div>
                    <input
                        type="file"
                        oninput={(e: any) => {
                            const file: File = e.target.files[0];
                            // 看看是否有种子号
                            const seed = file.name.match(/(?<=-)[\d]+(?=.+?$)/);
                            seed?.length && set('seed', seed[0]);
                            uploadPicture(file);
                        }}
                    />
                </div>

                {uploading() && (
                    <div class="btn w-full text-center text-red-700">
                        上传图片中，请等待完成。。。
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
                    <label class="flex-none ">种子号码</label>
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
                <div
                    class="my-2 mx-4 flex items-center justify-between"
                    onclick={() => set('r18', !store.r18)}
                >
                    <label class="flex-none text-green-600">是否适合未成年</label>
                    <div
                        class="h-6 w-6 rounded-md border border-solid border-slate-700 transition-colors duration-300"
                        classList={{
                            'bg-blue-500': !store.r18,
                            'bg-gray-800': store.r18,
                        }}
                    ></div>
                </div>
            </main>
            <div class="cursor-pointer bg-green-600 p-2  text-center text-white" onClick={upload}>
                提交! <span class="text-xs">森林会记住一切</span>
            </div>
        </Panel>
    );
};
