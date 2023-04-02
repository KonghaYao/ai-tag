import { WebViewLink } from '../Panels/Webview';
import { GlobalData } from '../store/GlobalData';

export const ControlBar = () => {
    const { visibleId } = GlobalData.getApp('side-app');
    return (
        <div class="flex h-8 items-center justify-evenly bg-gray-800">
            <WebViewLink href="/notebook.html">
                <button class="btn bg-sky-700 text-gray-300">笔记本</button>
            </WebViewLink>
            <button class="btn bg-green-700 text-gray-300" onclick={() => visibleId('feedback')}>
                反馈
            </button>
            <button class="btn bg-amber-700 text-gray-300" onclick={() => visibleId('home')}>
                主页
            </button>
            <button class="btn bg-pink-700 text-gray-300" onclick={() => visibleId('')}>
                关闭
            </button>
        </div>
    );
};
