import { lazy, onMount } from 'solid-js';
import { Panel } from '../components/Panel';

const load = (url: string) => {
    const script = document.createElement('script');
    script.src = url;
    return new Promise((res, rej) => {
        document.body.appendChild(script);
        script.onload = () => res(null);
        script.onerror = (e) => rej(e);
    });
};
import './TalkPanel.css';
export const TalkPanel = () => {
    const Comp = lazy(async () => {
        await load('https://unpkg.com/valine@1.5.1/dist/Valine.min.js');
        return {
            default: () => {
                let container: HTMLDivElement;
                onMount(() => {
                    injectDom();
                });
                const injectDom = () => {
                    new globalThis.Valine({
                        el: container,
                        placeholder: '发表你的评论吧！',
                        avatar: 'hide',
                        highlight: false,
                        meta: ['nick'],
                        appId: 'mnyUPAL9vkRPOc9skLlWxupw-gzGzoHsz',
                        appKey: 'SanjNh0jdz4fP1dS0Bc1Inrf',
                        serverURLs: 'https://mnyupal9.lc-cn-n1-shared.com',
                    });
                };
                return <div ref={container}></div>;
            },
        };
    });

    return (
        <Panel id="talk">
            <div class="w-full flex-1 overflow-auto p-2">
                <Comp></Comp>
            </div>
        </Panel>
    );
};
