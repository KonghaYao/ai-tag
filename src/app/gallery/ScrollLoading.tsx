export const ScrollLoading = (cb: () => void, space = 100) => {
    const ScrollEvent = (e: Event) => {
        const dom = e.target as HTMLElement;
        //文档内容实际高度（包括超出视窗的溢出部分）
        let scrollHeight = Math.max(dom.scrollHeight, dom.scrollHeight);
        //滚动条滚动距离
        let scrollTop = dom.scrollTop;
        //窗口可视范围高度
        let clientHeight = Math.min(dom.clientHeight, dom.clientHeight);
        if (clientHeight + scrollTop >= scrollHeight - space) {
            cb();
        }
    };
    return { ScrollEvent };
};
