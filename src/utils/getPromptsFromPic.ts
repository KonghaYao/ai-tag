/**
 * 代码抽取自 https://github.com/Akegarasu/novelai-tagreader/blob/main/src/components/Root.vue
 */

import prettyBytes from 'pretty-bytes';
import extractChunks from 'png-chunks-extract';
import text from 'png-chunk-text';
async function readNovelAITag(file: File) {
    const buf = await file.arrayBuffer();
    let chunks = [];
    try {
        chunks = extractChunks(new Uint8Array(buf));
    } catch (err) {
        return chunks;
    }
    const textChunks = chunks
        .filter(function (chunk) {
            return chunk.name === 'tEXt' || chunk.name === 'iTXt';
        })
        .map(function (chunk) {
            if (chunk.name === 'iTXt') {
                let data = chunk.data.filter((x) => x != 0x0);
                let txt = new TextDecoder().decode(data);
                return {
                    keyword: '信息',
                    text: txt.slice(11),
                };
            }
            return text.decode(chunk.data);
        });
    return textChunks;
}
/** 读取文件代码，并返回一个 entries 数组 */
export async function readFileInfo(file: File) {
    let nai = await readNovelAITag(file);
    if (nai.length == 1) {
        nai = await handleWebUiTag(nai[0]);
    }
    if (nai.length == 0) {
        throw new Error('提示: 这可能不是一张 NovelAI 生成的图或者不是原图, 经过了压缩');
    }
    return [
        ['文件名', file.name],
        ['文件大小', prettyBytes(file.size)],

        ...nai.map((v, k) => {
            if (v.keyword == 'Comment') {
                return [v.keyword, JSON.parse(v.text)];
            }
            return [v.keyword, v.text];
        }),
    ] as [string, any][];
}
async function handleWebUiTag(data) {
    let promptSplit = data.text.split('Negative prompt: ');
    let [badPrompt, Details] = promptSplit[1].split('Steps: ');
    return [
        {
            keyword: 'Description',
            text: promptSplit[0],
        },
        {
            keyword: 'Software',
            text: 'Stable Diffusion WebUI',
        },
        {
            keyword: 'Comment',
            text: JSON.stringify({
                uc: badPrompt,
                ...Object.fromEntries(
                    ('Steps: ' + Details)
                        .split(',')
                        .map((i) => i.split(':').map((i) => i.toLowerCase().trim()))
                ),
            }),
        },
    ];
}
