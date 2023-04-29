import { DefaultGPT } from './prompt-gpt/DefaultGPT';
import { InstructGPT } from './prompt-gpt/InstructGPT';
import { UploadResult, checkInput, needToken } from './prompt-gpt/decorators';
async function* readStreamAsTextLines(stream: ReadableStream<Uint8Array>) {
    const linesReader = stream.pipeThrough(new TextDecoderStream()).getReader();
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
    /** 基础描述文本生成长文本 */
    @checkInput
    @UploadResult
    textToText(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `Below is a highly advanced image description that enriches the expressiveness of the text and converts it into a descriptive text that retains more key information. It should contain quality description, style description, subject description, detail description, .combine them to one english row text output within ${length} words. input:  ${text}`,
                id: '0',
            },
            notify
        );
    }

    /** 基础描述文本生成 Tags 组     */
    @checkInput
    @UploadResult
    textToTags(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `下面将会给出非常高级的图片描述，丰富这段文本的表现力并转化为保留较多关键信息的关键词组，按照画面质量描述与风格词汇、主体描述、细节描述的顺序以逗号分隔， ${length} 词左右，英文小写输出，合并为一行:${text}`,
                id: '0',
            },
            notify
        );
    }
    /** Tags 转化为文本 */
    @checkInput
    @UploadResult
    TagsToText(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `将关键词组合成描述画面的语句，英文回答，直接描述不讲废话，写到长度 ${length}： ${text}`,
                id: '0',
            },
            notify
        );
    }
    /** 绘画风格，输入可以为空，空时是随机*/
    @UploadResult
    StyleTags(text: string, length = 20, notify: Notify) {
        return this.query(
            {
                prompt: `你是绘画大师，精通各种风格的绘画，只讨论技法，不讨论情感，不要输出多余的话。描述一张${text}绘画的风格，汇总成${length}个左右英文关键词一行用逗号分隔并返回，结果`,
                id: '0',
            },
            notify
        );
    }
    /** 续写文本 */
    @needToken
    @checkInput
    @UploadResult
    ContinueWriting(text: string, length: number, notify: Notify) {
        return this.query(
            { id: '0', prompt: `请以 ${text} 开头，写出 ${length} 字左右的句子` },
            notify
        );
    }
    /** 直接提问 */
    @needToken
    @checkInput
    @UploadResult
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
            return allText;
        });
    }
}
export const GlobalGPT = new PromptGPT();
