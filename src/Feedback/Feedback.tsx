import { atom, useSingleAsync } from '@cn-ui/use';
import { debounce } from 'lodash-es';
import { For, useContext } from 'solid-js';
import { Data } from '../App';
import { Panel } from '../components/Panel';
import { Notice } from '../utils/notice';
import { commitFeedBack, FeedBackMessage, FeedBackTags, Labels } from './index';
export const FeedBackPanel = () => {
    const { visibleId } = useContext(Data);
    const callbacks = atom<FeedBackMessage>({
        author: '',
        title: '',
        labels: ['ADD_WORDS', 'bot'],
        body: '',
    });
    const checks = () => {
        const form = callbacks();
        if (form.title && form.body) {
            return true;
        } else {
            return false;
        }
    };
    const Commit = useSingleAsync(() => {
        if (checks()) {
            const form = callbacks();
            Notice.success('提交中。。。');
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
                Notice.success('提交成功, 感谢您的反馈');
            });
        } else Notice.error('请完成填写');
    });
    return (
        <Panel id="feedback">
            <h3 class="my-2 text-center text-lg font-bold">反馈信息</h3>
            <div class="flex flex-col gap-2 p-4">
                <div
                    class="cursor-pointer border border-dashed border-green-800 py-2 text-center text-white transition-colors hover:bg-gray-800"
                    onClick={() => visibleId('my-feedback')}
                >
                    查看以前的反馈
                </div>
                <div class="flex justify-between">
                    <span class="flex-none">我想要</span>
                    <select
                        value={callbacks().labels[0]}
                        class="ml-2 appearance-none bg-gray-800 px-2 outline-none"
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
                                return <option value={item.value}>{item.name}</option>;
                            }}
                        </For>
                    </select>
                </div>
                <div class="flex ">
                    <span class="flex-none">问题标题</span>
                    <input
                        value={callbacks().title}
                        class="ml-4 w-full appearance-none rounded-md bg-gray-800 px-2 outline-none"
                        onChange={(e: any) => {
                            callbacks((i) => ({
                                ...i,
                                title: e.target.value,
                            }));
                        }}
                    ></input>
                </div>
                <div class="flex ">
                    <span class="flex-none">你的名称</span>
                    <input
                        placeholder="选填"
                        value={callbacks().author}
                        class="ml-4 w-full appearance-none rounded-md bg-gray-800 px-2 outline-none"
                        onChange={(e: any) => {
                            callbacks((i) => ({
                                ...i,
                                author: e.target.value,
                            }));
                        }}
                    ></input>
                </div>
                <div>
                    具体描述
                    <textarea
                        value={callbacks().body}
                        class="w-full appearance-none rounded-md bg-gray-800 px-2 outline-none"
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
                提交，感谢您的支持！
            </div>
        </Panel>
    );
};
