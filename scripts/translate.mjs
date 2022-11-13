import traverse from 'traverse';
import fetch from 'node-fetch';
import fs from 'fs';
import { gtk, getSign, token, cookie } from './transInput.mjs';
import { merge } from 'lodash-es';

async function trans(q, from, to) {
    const body = new URLSearchParams();
    body.append('sign', getSign(q, gtk));
    body.set('from', from);
    body.set('to', to);
    body.set('query', q);
    body.set('transtype', 'realtime');

    body.set('domain', 'common');
    body.set('token', token);
    body.set('simple_means_flag', '3');
    return await fetch('https://fanyi.baidu.com/v2transapi?from=zh&to=en', {
        headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
            cookie,
            Referer: 'https://fanyi.baidu.com/',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body,
        method: 'POST',
    })
        .then((res) => res.json())
        .then((res) => {
            return res.trans_result.data[0].dst;
        });
}
