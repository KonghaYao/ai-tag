import 'https://cdn.jsdelivr.net/npm/leancloud-storage@4.14.0/dist/av-min.js';
(globalThis.AV as any).init({
    appId: 'mnyUPAL9vkRPOc9skLlWxupw-gzGzoHsz',
    appKey: 'SanjNh0jdz4fP1dS0Bc1Inrf',
    serverURLs: 'https://mnyupal9.lc-cn-n1-shared.com',
});

import type _AV from 'leancloud-storage';
export const AV: typeof _AV = globalThis.AV as any;
