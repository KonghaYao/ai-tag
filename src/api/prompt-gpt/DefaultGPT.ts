import { sign } from '@tsndr/cloudflare-worker-jwt';

export const DefaultGPT = async (_prompt: string) => {
    console.log('使用默认服务: ', _prompt);
    const token = await sign(
        {
            name: Math.random().toString() + Date.now(),
        },
        // 如果你看到这一行的具体数据，那么你应该忘记它，而不是使用它！
        import.meta.env.PUBLIC_JWT_PROMPT
    );
    return fetch(
        'https://prompt-gpt.deno.dev/ai',
        // 'https://civitai.deno.dev/ai',
        {
            method: 'POST',
            headers: {
                Authorization: 'Barer ' + token,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ prompt: _prompt, id: '0' }),
        }
    );
};
