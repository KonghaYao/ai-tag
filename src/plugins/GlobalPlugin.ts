import { Atom, atom, createBlackBoard } from '@cn-ui/use';
import { onMount } from 'solid-js';

export const GlobalPlugin = createBlackBoard<{
    translation: {
        show: Atom<boolean>;
        translate: (text: string) => void;
    };
}>();

export const useBlackBoard = <T extends Record<string,any>,E extends keyof T>(bd:ReturnType<typeof createBlackBoard<T>>,name:E)=>{
    const app = atom<T[E]>(null as any)
    onMount(() => {
        const ready= bd.getApp(name)
        app(()=>ready)
    })
    return app
}
