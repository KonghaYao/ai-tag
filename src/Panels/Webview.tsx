import { atom } from '@cn-ui/use';
import { batch, Component, JSXElement, Show, useContext } from 'solid-js';
import { ErrorBoundary } from 'solid-js';
import { useTranslation } from '../../i18n';
import { Data } from '../App';
import { Panel, PanelContext } from '../components/Panel';

export const WebViewLink: Component<{ children: JSXElement; href: string }> = (props) => {
    const { nav } = useWebView();
    return (
        <span class="text-green-500" onclick={() => nav(props.href)}>
            {props.children}
        </span>
    );
};

export const useWebView = () => {
    const { visibleId, webviewURL } = useContext(Data);
    return {
        nav(url: string) {
            const pos = new URL(url, globalThis.location.toString());
            batch(() => {
                webviewURL(pos.toString());
                visibleId('webview');
            });
        },
    };
};

export const Webview = () => {
    const { t } = useTranslation();
    const { isPanelVisible } = useContext(PanelContext);
    const { webviewURL } = useContext(Data);

    let container: HTMLIFrameElement;
    const loading = atom(true);
    return (
        <Panel id="webview">
            <Show when={isPanelVisible('webview')}>
                {/* <div class="flex">
                    <a href={webviewURL()} target="_blank">
                        <div class="btn m-2"> {t('WebView.newPage')}</div>
                    </a>
                    <div></div>
                </div> */}
                <div class="relative h-full w-full">
                    {loading() && <div> {t('upload')}</div>}
                    <ErrorBoundary
                        fallback={() => {
                            return (
                                <div>
                                    {t('WebView.Error')}
                                    <a href={webviewURL()}>{webviewURL()}</a>
                                </div>
                            );
                        }}
                    >
                        <iframe
                            ref={container}
                            sandbox="allow-scripts allow-popups allow-same-origin allow-modals"
                            class="absolute top-0 left-0 h-full w-full"
                            src={webviewURL()}
                            onload={(e) => {
                                console.log(webviewURL(), '加载完毕');
                                loading(false);
                            }}
                        ></iframe>
                    </ErrorBoundary>
                </div>
            </Show>
        </Panel>
    );
};
