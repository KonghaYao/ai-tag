import { sign } from '@tsndr/cloudflare-worker-jwt';
async function* readStreamAsTextLines(stream: ReadableStream<Uint8Array>) {
    const linesReader = stream
        .pipeThrough(new TextDecoderStream())

        .getReader();
    while (true) {
        const { value, done } = await linesReader.read();
        if (done) break;
        yield value;
    }
}
interface Notify {
    (text: string, per: number): void;
}

const InstructGPT = (_prompt: string, token: string) => {
    console.log('使用自己的TOKEN: ', _prompt);
    return fetch('https://openai-proxy-magic.deno.dev', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
const DefaultGPT = async (_prompt: string) => {
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

export class PromptGPT {
    constructor() {}

    /**
     * 基础描述文本生成长文本
     */
    textToText(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `一句描述${text}的画作的专业评价语句，${length} 词以上，发挥想象力扩展文字，英文，直接描述不要输出多余的话，不要引号`,
                id: '0',
            },
            notify
        );
    }
    /**
     * 基础描述文本生成 Tags 组
     */
    textToTags(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `获取一句描述${text}的画作的专业评价语句中的关键词，${length} 关键词以上，发挥想象，英文，不要引号，直接描述不要输出多余的话，不要开头的 Key Words`,
                id: '0',
            },
            notify
        );
    }
    /**
     * Tags 转化为文本
     */
    TagsToText(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `将关键词组合成描述画面的语句，英文回答，直接描述不讲废话，写到长度 ${length}： ${text}`,
                id: '0',
            },
            notify
        );
    }
    /** 续写文本 */
    ContinueWriting(text: string, length: number, notify: Notify) {
        return this.query(
            { id: '0', prompt: `请以 ${text} 开头，写出 ${length} 字左右的句子` },
            notify
        );
    }
    /** 直接提问 */
    AskAnything(text: string, _: number, notify: Notify) {
        return this.query({ id: '0', prompt: text }, notify);
    }

    get ownKey() {
        return localStorage.getItem('open_ai_key') ?? '';
    }
    set ownKey(str: string) {
        localStorage.setItem('open_ai_key', str);
    }
    get GPT() {
        return this.ownKey ? InstructGPT : DefaultGPT;
    }
    async query(data: { prompt: string; id: string }, notify: Notify) {
        let allText = '';

        return this.GPT(data.prompt, this.ownKey).then(async (res) => {
            const stream = res.body;
            for await (const text of readStreamAsTextLines(stream!)) {
                if (!text) continue;
                allText += text;
                notify(allText, 50);
            }
        });
    }
}
export const GlobalGPT = new PromptGPT();
