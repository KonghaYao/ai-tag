import { useWebView } from '../Panels/Webview';

export const triggerNews = () => {
    const { nav } = useWebView();
    if (localStorage.getItem('version_news') !== __version__) {
        nav('/news');
    }
};
