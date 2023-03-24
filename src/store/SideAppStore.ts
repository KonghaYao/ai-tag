import { atom } from '@cn-ui/use';
import isMobile from 'is-mobile';
import type { PanelIds } from '../app/SideApp';
import { Component, createSelector } from 'solid-js';
import { GlobalData } from './GlobalData';

export type ISideAPPStore = ReturnType<typeof initSideApp>;

export const initSideApp = () => {
    const sideAppMode = atom(!isMobile());
    const visibleId = atom<PanelIds | ''>('ai-prompt');
    const isPanelVisible = createSelector(visibleId);
    const extraPanels = atom(new Map<'' | PanelIds, Component>(), { equals: false });
    const context = {
        sideAppMode,
        visibleId,
        extraPanels,
        isPanelVisible,
        registerPanel: (name: '' | PanelIds, comp: Component) => {
            extraPanels((i) => i.set(name, comp));
        },
    };
    GlobalData.register('side-app', context);
    return context;
};
