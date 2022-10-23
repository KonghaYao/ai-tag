import { createEffect } from 'solid-js';
import { Atom } from '@cn-ui/use';

export const useStorage = (data: { [name: string]: Atom<any> }) => {
    return {
        recover() {
            Object.entries(data).map(([name, value]) => {
                const old = localStorage.getItem(name);
                if (old !== null) value(JSON.parse(old));
            });
        },
        tracking() {
            Object.entries(data).map(([name, value]) => {
                createEffect(() => {
                    console.log('存储设置');
                    localStorage.setItem(name, JSON.stringify(value()));
                });
            });
        },
    };
};
