import { atom, resource } from '@cn-ui/use';
import { Component, For, Show, createEffect, useContext } from 'solid-js';
import { AV } from '../api/cloud';
import { usePagination } from '@cn-ui/headless';
import { timeAgo } from './timeage';
import { TalkMarkdown } from './TalkMarkdown';
import { TalkContext } from './TalkContext';
import { Queriable } from 'leancloud-storage';

export const createSubQuery = async (DatabaseName: string, idsArr: string[]) => {
    let ids = JSON.stringify(idsArr).replace(/(\[|\])/g, '');
    let cql = `select * from ${DatabaseName} where rid in (${ids}) order by -createdAt,-createdAt`;
    return AV.Query.doCloudQuery(cql).then((res) => (res as any).results);
};
export const createCommonQuery = (DatabaseName: string, url: string) => {
    let notExist = new AV.Query(DatabaseName);
    notExist.doesNotExist('rid');
    let isEmpty = new AV.Query(DatabaseName);
    isEmpty.equalTo('rid', '');
    let q = AV.Query.or(notExist, isEmpty);
    q.equalTo('url', url);
    q.addDescending('createdAt');
    q.addDescending('insertedAt');
    return q;
};

export const CommentList = () => {
    const { DatabaseName, url, refreshPage } = useContext(TalkContext);
    const total = resource(() => {
        return createCommonQuery(DatabaseName, url).count();
    });
    let rootIds: string[] = [];
    const subQuery = resource<CommentObject[]>(
        async () => {
            if (rootIds.length === 0) return [];
            return createSubQuery(DatabaseName, rootIds);
        },
        { initValue: [], immediately: false }
    );

    const { currentData, currentPage, maxPage, next, prev } = usePagination((page, maxPage) => {
        maxPage(() => Math.ceil(total() / 5));

        return createCommonQuery(DatabaseName, url)
            .limit(5)
            .skip(5 * page)
            .find()
            .then((res) => {
                rootIds = res.map((i) => i.id);
                subQuery.refetch();
                return res as CommentObject[];
            });
    });
    refreshPage(() => {
        return () => currentData.refetch();
    });
    createEffect(() => {
        maxPage(() => Math.ceil(total() / 5));
    });

    return (
        <div>
            <Show when={total.isReady()}>
                <div class="text-lg">{total()}条评论</div>
            </Show>
            <div class="flex gap-2">
                <div class="btn" onclick={() => prev()}>
                    上一页
                </div>
                <div class="flex-1 text-center">
                    {currentPage()}/{maxPage()}
                </div>
                <div class="btn" onclick={next}>
                    下一页
                </div>
            </div>
            <main class="flex flex-col  divide-y divide-slate-400">
                <Show when={currentData.isReady()}>
                    <For each={currentData()}>
                        {(item) => {
                            return (
                                <CommentItem
                                    data={item}
                                    subChildren={
                                        subQuery().filter((i) => i.attributes.pid === item.id) ?? []
                                    }
                                    subMode={false}
                                ></CommentItem>
                            );
                        }}
                    </For>
                </Show>
            </main>
        </div>
    );
};
export interface CommentData {
    nick: string;
    ip: string;
    updatedAt: string;
    objectId: string;
    mail: string;
    ua: string;
    insertedAt: {
        __type: 'Date';
        iso: string;
    };
    rid: string;
    pid: string;
    link: string;
    comment: string;
    url: string;
    QQAvatar: string;
}
export type CommentObject = { attributes: CommentData } & Queriable;

export const CommentItem: Component<{
    data: CommentObject;
    subChildren: CommentObject[];
    subMode: boolean;
}> = (props) => {
    const attr = props.data.attributes;
    const { atSomeone } = useContext(TalkContext);
    return (
        <div class="">
            <header class=" mt-2 flex justify-between text-sm">
                <div>{attr.nick === 'Anonymous' ? '匿名' : attr.nick}</div>
                <div class="text-xs">{timeAgo(new Date(props.data.createdAt))}</div>
            </header>
            <main class="select-text  p-2" style="letter-spacing: 0.05em;word-break: break-all;">
                <TalkMarkdown code={attr.comment}></TalkMarkdown>
            </main>

            <Show when={props.subChildren?.length}>
                <div class="ml-4 mb-2 flex flex-col gap-1 divide-y divide-slate-400 border-l bg-slate-700 pl-2">
                    <For each={props.subChildren}>
                        {(item) => {
                            return (
                                <CommentItem
                                    data={item}
                                    subChildren={[]}
                                    subMode={true}
                                ></CommentItem>
                            );
                        }}
                    </For>
                </div>
            </Show>
            <Show when={!props.subMode}>
                <div
                    class="my-1 w-full  cursor-pointer rounded bg-slate-700 text-center text-sm transition-colors"
                    onclick={() => {
                        atSomeone(props.data);
                    }}
                >
                    添加回复
                </div>
            </Show>
        </div>
    );
};
