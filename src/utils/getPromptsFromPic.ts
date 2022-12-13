/**
 * 代码抽取自 https://github.com/Akegarasu/novelai-tagreader/blob/main/src/components/Root.vue
 */

import prettyBytes from 'pretty-bytes';
import { PromptExtractor } from 'prompt-extractor';

/** 读取文件代码，并返回一个 entries 数组 */
export async function readFileInfo(file: File) {
    const data = await PromptExtractor(await file.arrayBuffer());
    return [
        ['文件名', file.name],
        ['文件大小', prettyBytes(file.size)],

        ...Object.entries(data),
    ] as [string, any][];
}
