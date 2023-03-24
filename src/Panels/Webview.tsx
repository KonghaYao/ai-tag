import { atom } from '@cn-ui/use';
import { batch, Component, JSXElement, Show, useContext } from 'solid-js';
import { ErrorBoundary } from 'solid-js';
import { useTranslation } from '../i18n';
import { Panel, PanelContext } from '../components/Panel';
import { GlobalData } from '../store/GlobalData';

export const WebViewLink: Component<{ children: JSXElement; href: string }> = (props) => {
    const { nav } = useWebView();
    return (
        <span class="text-green-500" onclick={() => nav(props.href)}>
            {props.children}
        </span>
    );
};

export const useWebView = () => {
    const { webviewURL } = GlobalData.getApp('data');
    const { visibleId } = GlobalData.getApp('side-app');

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
    const { isPanelVisible } = GlobalData.getApp('side-app');
    const { webviewURL } = GlobalData.getApp('data');

    let container!: HTMLIFrameElement;
    const loading = atom(true);
    return (
        <>
            <Show when={isPanelVisible('webview')}>
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
                            sandbox="allow-scripts  allow-modals allow-same-origin"
                            class="absolute top-0 left-0 h-full w-full"
                            src={webviewURL()}
                            onload={(e) => {
                                console.log(webviewURL(), '加载完毕');
                                loading(false);
                            }}
                        ></iframe>
                    </ErrorBoundary>
                    <div
                        class="btn fixed bottom-4 right-4"
                        onclick={() => {
                            window.open(webviewURL(), '_blank');
                        }}
                    >
                        原站
                    </div>
                </div>
            </Show>
        </>
    );
};
