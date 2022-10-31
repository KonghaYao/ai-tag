import { atom, createIgnoreFirst, useSingleAsync } from '@cn-ui/use';
import { For, useContext } from 'solid-js';
import { FeedBackMessage, getIssueState, Labels } from '.';
import { Data } from '../App';
import { Panel } from '../components/Panel';
export const MyFeedBackPanel = () => {
    const { visibleId } = useContext(Data);
    const data = atom<(FeedBackMessage & { url: string; state?: string })[]>(
        JSON.parse(localStorage.getItem('__my_feedback__') ?? '[]')
    );
    createIgnoreFirst(() => {
        localStorage.setItem('__my_feedback__', JSON.stringify(data()));
    }, [data]);
    return (
        <Panel id="my-feedback">
            <h3 class="my-2 text-center text-lg font-bold">我的反馈</h3>
            <div>
                <div
                    class="cursor-pointer border border-dashed border-green-800 py-2 text-center text-white transition-colors hover:bg-gray-800"
                    onClick={() => visibleId('feedback')}
                >
                    我要反馈
                </div>
                <div class="flex flex-col gap-2 p-4">
                    <For each={data()}>
                        {(item, index) => {
                            return (
                                <nav class="flex flex-col border-b border-gray-300 py-2 ">
                                    <header class="flex gap-2 ">
                                        <div
                                            class=" text-white"
                                            classList={{
                                                'bg-green-700': item.state === 'open',
                                                'bg-purple-700': item.state === 'closed',
                                                'bg-gray-700': item.state === undefined,
                                            }}
                                            onClick={useSingleAsync(async () => {
                                                if (item.state === undefined) {
                                                    const state = await getIssueState(item.url);
                                                    data((i) => {
                                                        const id = index();
                                                        i[id] = { ...i[id], state };
                                                        return [...i];
                                                    });
                                                }
                                            })}
                                        >
                                            状态:
                                            {item.state === undefined
                                                ? '点我更新'
                                                : item.state !== 'open'
                                                ? '已完成'
                                                : '未完成'}
                                        </div>
                                        <div class="flex-none text-green-400">
                                            {
                                                Labels.find(
                                                    (i) => i.value === (item?.labels || [])[0]
                                                )?.name
                                            }
                                        </div>
                                        <div class="line-clamp-1">{item.title}</div>
                                    </header>
                                    <div class="line-clamp-1">{item.body}</div>
                                    <a href={item.url} target="_blank">
                                        {item.url}
                                    </a>
                                </nav>
                            );
                        }}
                    </For>
                </div>
            </div>
            <div class="flex-1"></div>
        </Panel>
    );
};
