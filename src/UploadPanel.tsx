import { createEffect, For, useContext } from 'solid-js';
import { Data } from './App';
import { createStore } from 'solid-js/store';
import { Panel } from './components/Panel';
import { API, StoreData } from './api/notion';
import { atom } from '@cn-ui/use';
import { stringToTags } from './utils/stringToTags';
import { Notice } from './utils/notice';
import { untrack } from 'solid-js/web';
import { TagsToString } from './use/TagsToString';
const init = {
    username: '',
    tags: [],
    r18: true,
    image: '',
    description: '',
    origin_tags: '',
} as StoreData;
const [store, set] = createStore({ ...init });

export const UploadPanel = () => {
    const { username, usersCollection, isPanelVisible } = useContext(Data);
    const uploading = atom(false);
    const check = () => {
        if (store.description && username() && store.image && store.origin_tags) {
            return true;
        }
        return false;
    };
    const upload = () => {
        if (check()) {
            API.uploadData({ ...store, username: username() }).then(() => {
                set(() => ({ ...init }));
                Notice.success('上传完成');
            });
        } else {
            Notice.error('你的法力好像有些缺失呀！');
        }
    };
    createEffect(() => {
        if (isPanelVisible('uploader')) {
            const list = untrack(usersCollection);
            set(
                'tags',
                list.map((i) => i.en)
            );
            set('origin_tags', TagsToString(list));
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
                        oninput={(e) => {
                            /** @ts-ignore */
                            const file = e.target.files[0];
                            const fd = new FormData();
                            fd.append('key', '0000239c0acbbcb3bdedc2b1c6983537');
                            fd.append('media', file);
                            uploading(true);
                            fetch('https://thumbsnap.com/api/upload', {
                                method: 'post',
                                body: fd,
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    uploading(false);
                                    set('image', res.data.thumb);
                                });
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
