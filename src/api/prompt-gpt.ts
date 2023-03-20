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
export class PromptGPT {
    constructor() {}

    /**
     * 基础描述文本生成长文本
     */
    textToText(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `一句描述${text}的画作的专业评价语句，${length} 词以上，发挥想象，英文，直接描述不要输出多余的话，不要引号`,
                id: '0',
            },
            notify
        );
    } /**
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

    async query(data: { prompt: string; id: string }, notify: Notify) {
        const token = await this.getToken();
        let allText = '';
        return fetch('https://prompt-gpt.deno.dev/ai', {
            method: 'POST',
            headers: {
                Authorization: 'Barer ' + token,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async (res) => {
            const stream = res.body;
            for await (const text of readStreamAsTextLines(stream)) {
                if (!text) continue;
                // if (text === 'data: [DONE]') break;
                // if (!text.startsWith('data: ')) throw new Error('Unexpected text: ' + text);
                allText += text;
                notify(allText, 50);
            }
        });
    }
    getToken() {
        return sign(
            {
                name: Math.random().toString() + Date.now(),
            },
            // 如果你看到这一行的具体数据，那么你应该忘记它，而不是使用它！
            import.meta.env.VITE_JWT_PROMPT
        );
    }
}
export const GlobalGPT = new PromptGPT();
