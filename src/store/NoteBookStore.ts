import { atom } from '@cn-ui/use';
import { ExposeToGlobal, GlobalData } from './GlobalData';
import { useIndexedDB } from '../app/notebook/use/useIndexedDB';

export type INoteBookStore = ReturnType<typeof initNoteBookStore>;
export const initNoteBookStore = ExposeToGlobal('notebook', () => {
    return { hidImage: atom(false), ...useIndexedDB() };
});
