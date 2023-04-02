import { useWebView } from '../Panels/Webview';

/** 检测是否为最新新闻，自动弹出最新消息 */
export const triggerNews = () => {
    const { nav } = useWebView();
    if (localStorage.getItem('version_news') !== __version__) {
        nav('/news');
    }
};
