import { createAC } from '@cn-ui/headless';

export const AC = createAC({
    error(e) {
        console.error(e.error());
        return <div>发生错误了</div>;
    },
    loading(data) {
        return <div>加载中，请稍等</div>;
    },
});
