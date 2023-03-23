import { atom } from '@cn-ui/use';
import { ExposeToGlobal, GlobalData } from '../../store/GlobalData';
import type { CommentObject } from './CommentList';

export const initTalkStore = ExposeToGlobal('talk', () => {
    const scrollContainer = atom<HTMLDivElement | null>(null);
    return {
        VERSION: '1.0.0',
        url: '/',
        DatabaseName: 'Comment',
        appId: 'mnyUPAL9vkRPOc9skLlWxupw-gzGzoHsz',
        appKey: 'SanjNh0jdz4fP1dS0Bc1Inrf',
        serverURLs: 'https://mnyupal9.lc-cn-n1-shared.com',

        scrollContainer,
        backToTop() {
            scrollContainer()!.scrollIntoView();
        },
        refreshPage: atom(() => {}),
        /** 准备 回复的用户 */
        atSomeone: atom<CommentObject | null>(null),
    };
});
export type ITalkStore = ReturnType<typeof initTalkStore>;
