const __rapid_tokens__ = import.meta.env.VITE_RAPID_TOKENS.split(',').filter((i) => i);
const token = () => {
    const index = Math.floor(Math.random() * __rapid_tokens__.length);
    console.log('响应服务器编号', index);
    return __rapid_tokens__[index];
};
// rapidAPI 的测试使用，但是有次数限制
export const rapidAPI = (url: string, options?: RequestInit) => {
    if (options) {
        options.headers = {
            ...(options.headers ?? {}),
            'x-requested-with': new URL(url).host,
            'X-RapidAPI-Key': token(),
            'X-RapidAPI-Host': 'http-cors-proxy.p.rapidapi.com',
        };
    }
    return fetch(`https://http-cors-proxy.p.rapidapi.com/${url}`, options);
};
// json bird 的 fetch 但是速度不稳定
export const jsonBird = (url: string, options?: RequestInit) => {
    console.log(url, options);
    const params = new URLSearchParams();
    params.set('url', url.toString());
    if (options) {
        const headers = `method='Post',config.body=\`${options.body}\`,{${Object.entries(
            options.headers
        )
            .map(([key, value]) => `"${key}":"${value}"`)
            .join(',')}}`;
        options.body = JSON.stringify({
            url: url.toString(),
            headers,
        });
        options.headers = {
            'content-type': 'application/json',
        };
    }
    return fetch('https://bird.ioliu.cn/v2', options);
};

//
const requests = [rapidAPI, jsonBird];
// const requests = [MyAgent];
/** 垫底请求，多个 api 合为一个 */
export const fetchWithAgent = (url: string, options?: RequestInit) => {
    return new Promise(async (resolve) => {
        for (const fetch of requests) {
            try {
                const data = await fetch(url, options).then((res) => {
                    if (res.ok) return res;
                    throw res.status;
                });
                resolve(data);
                break;
            } catch (e) {
                console.warn('请求失败', e);
                continue;
            }
        }
    });
};
