/** 使用 huggingface 提供的跨域服务进行 prompt 生成 */
export const useAIWritePrompt = (inputs: string, API_TOKEN?: string) => {
    const start = Date.now();
    return fetch(
        // https://huggingface.co/Gustavosta/MagicPrompt-Stable-Diffusion 这个可以自动生成 tag
        'https://api-inference.huggingface.co/models/Gustavosta/MagicPrompt-Stable-Diffusion',
        {
            headers: {
                Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'x-use-cache': 'false',
                Referer: 'https://huggingface.co/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
            body: JSON.stringify({ inputs }),
            method: 'POST',
        }
    )
        .then((res) => res.json())
        .then<{
            generated_text: string;
            time: number;
        }>((res) => {
            return Object.assign(res[0], {
                time: Date.now() - start,
            });
        });
};
