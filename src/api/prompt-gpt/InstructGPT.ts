export const InstructGPT = (_prompt: string, token: string) => {
    console.log('使用自己的TOKEN: ', _prompt);
    return fetch('https://openai-proxy-magic.deno.dev', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            // davinci 比 turbo 模型要快不少，而且质量不会差
            model: 'text-davinci-003',
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['\n提问:', '\nAI:'],
            prompt: `\n提问:` + _prompt + `\nAI:`,
            stream: true,
        }),
    });
};
