/*
cloudflare 可以实现定时触发请求，而且可以缓存，所以就部署在 Cloudflare 了😂
这个玩意直接放在 cloudflare 的在线编辑器即可，需要设定全局变量，然后设置每天定时进行数据收集

*/

export default {
    async scheduled(event, env, ctx) {
        const list = [];
        for (let index = 1; index < 8; index++) {
            try {
                const data = await GetStatUnderCount(
                    `${env.PREFIX}${index}@snapmail.cc`,
                    env.PASSWORD
                );
                list[index - 1] = data;
                console.log(index, 'done');
            } catch (e) {
                console.log(index, 'error');
            }
        }
        const text = JSON.stringify(list);
        console.log('更新完毕');
        await fetch('https://mnyupal9.lc-cn-n1-shared.com/1.1/classes/stats', {
            headers: {
                'X-LC-Id': 'mnyUPAL9vkRPOc9skLlWxupw-gzGzoHsz',
                'X-LC-Key': 'SanjNh0jdz4fP1dS0Bc1Inrf',
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify({
                data: text,
                from: 'meili',
            }),
        });
        return text;
    },
    async fetch(request, env) {
        return new Response('ok');
    },
};

async function GetStatUnderCount(user, password) {
    const getToken = (user, password) => {
        return fetch('https://api.meilisearch.com/api/v1/users/login', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                Referer: 'https://cloud.meilisearch.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
            body: JSON.stringify({
                user: { email: user, password },
            }),
            method: 'POST',
        })
            .then((res) => res.json())
            .then((res) => {
                return res.data.token_info.token;
            });
    };
    const getProjects = (token) => {
        return fetch('https://api.meilisearch.com/api/v1/projects?sort%5B%5D=-created_at', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                authorization: 'Bearer ' + token,

                Referer: 'https://cloud.meilisearch.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
        })
            .then((res) => res.json())
            .then((res) => res.data);
    };
    const getStatFromProject = (token, id) => {
        return fetch(`https://api.meilisearch.com/api/v1/projects/${id}/usage`, {
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                authorization: 'Bearer ' + token,

                Referer: 'https://cloud.meilisearch.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
            body: null,
            method: 'GET',
        })
            .then((res) => res.json())
            .then((res) => res.data);
    };
    const token = await getToken(user, password);
    const projects = await getProjects(token);
    const data = await Promise.all(
        projects.map(async (i) => {
            delete i.apikey;
            const data = await getStatFromProject(token, i.id);

            return { ...i, usage: data };
        })
    );
    return data;
}
