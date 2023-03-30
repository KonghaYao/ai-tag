import { atom } from '@cn-ui/use';
import isMobile from 'is-mobile';
import type { PanelIds } from '../app/SideApp';
import { Component, createEffect, createSelector } from 'solid-js';
import { GlobalData } from './GlobalData';

export type ISideAPPStore = ReturnType<typeof initSideApp>;

export const initSideApp = () => {
    const sideAppMode = atom(!isMobile());

    const visibleId = atom<PanelIds | ''>(location.hash.slice(1) as any);
    createEffect(() => {
        location.hash = '#' + visibleId();
    });
    const isPanelVisible = createSelector(visibleId);
    const extraPanels = atom(new Map<'' | PanelIds, Component>(), { equals: false });
    const context = {
        sideAppMode,
        visibleId,
        extraPanels,
        isPanelVisible,
        isOpened() {
            const id = visibleId();
            return typeof id === 'string' && id;
        },
        registerPanel: (name: '' | PanelIds, comp: Component) => {
            extraPanels((i) => i.set(name, comp));
        },
    };
    GlobalData.register('side-app', context);
    return context;
};
