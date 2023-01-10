import { Atom } from '@cn-ui/use';
import { createContext } from 'solid-js';

export type TalkConfig = {
    VERSION?: string;
    meta?: string[];
    url?: string;
    DatabaseName?: string;
    appId: string;
    appKey: string;
    serverURLs: string;
    defaultUserName?: string;
};
import { CommentObject } from './CommentList';
export const TalkContext = createContext<
    Required<TalkConfig> & {
        atSomeone: Atom<CommentObject | null>;
        refreshPage: Atom<() => void>;
    }
>();
