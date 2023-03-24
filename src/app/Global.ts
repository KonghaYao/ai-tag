import type { JSXElement } from 'solid-js';
import { initGlobalData } from '../store';
import { initSideApp } from '../store/SideAppStore';
import { initGlobalTags } from '../store/useGlobalTags';

export const GlobalInit = (props: { children: JSXElement }) => {
    initSideApp();
    /** 需要持久化的变量写这里 */
    initGlobalData();
    initGlobalTags();
    return props.children;
};
