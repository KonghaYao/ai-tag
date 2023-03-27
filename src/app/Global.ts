import type { JSXElement } from 'solid-js';
import { initGlobalData } from '../store';
import { initSideApp } from '../store/SideAppStore';
import { initGlobalTags } from '../store/useGlobalTags';
import { initNoteBookStore } from '../store/NoteBookStore';

export const GlobalInit = (props: { children: JSXElement }) => {
    initSideApp();
    /** 需要持久化的变量写这里 */
    const data = initGlobalData();
    initGlobalTags(data);
    initNoteBookStore();
    return props.children;
};
