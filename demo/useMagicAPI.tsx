import { wrap, windowEndpoint } from 'comlink';

type MagicAPI = {
    inputPrompt: (promptString: string) => Promise<true>;
    onPromptChange(cb: (prompt: string) => void): Promise<void>;
    combinePrompt: (promptString: string) => Promise<true>;
    getPrompt: () => Promise<string>;
};
export const useMagicAPI = (ifr: HTMLIFrameElement) => {
    let prepare = new Promise((resolve) => {
        ifr.onload = resolve;
    }).then(() => {
        return wrap<MagicAPI>(windowEndpoint(ifr.contentWindow));
    });

    return {
        async getMagicAPI() {
            return prepare;
        },
    };
};
