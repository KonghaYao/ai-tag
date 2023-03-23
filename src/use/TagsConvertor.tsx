import type { ITagData } from '../app/main/App';

import { PromptToTags, TagsToPrompt } from 'promptor';

/** 预处理来源字符出串，将一些字符进行转换 */
export const PreProcess = (s: string) => {
    return s.replace(/_/g, ' ').split(/\r?\n/g);
};

export const isBreakSymbol = (a: ITagData) => {
    return a.text === breakSymbol.text && a.en === breakSymbol.en && a.cn === breakSymbol.cn;
};

export const breakSymbol: ITagData = {
    text: '\n',
    en: `\n`,
    cn: '\n',
    r18: 0,
    count: -1,
    emphasize: 0,
};
/** 将字符串转化为 Tag 数组 */
export const stringToTags = (s: string, list: ITagData[] = []): ITagData[] => {
    //* 添加对换行符的处理，认为换行符是一个组的标记
    const data = PreProcess(s).map((i, index) => PromptToTags(i));
    return data.flatMap((part, index) => {
        const res = part.map((i) => {
            const en = list.find((it) => i.text === it.en);
            if (en) return { ...en, ...i };
            const cn = list.find((it) => i.text === it.cn);
            if (cn) return { ...cn, ...i };
            return {
                en: i.text,
                cn: i.text,
                count: Infinity,
                r18: 0,
                ...i,
            } as ITagData;
        });
        if (index === 0) return [...res];
        return [{ ...breakSymbol }, ...res];
    });
};

/** 将用户的 Tag 转化为字符串 */
export const TagsToString = (
    data: ITagData[],
    positive = '()',
    /** 默认是保留分隔符的 */
    keepBreakLine = true
) => {
    if (keepBreakLine) {
        let lastStart = 0;
        let final = [];

        for (let index = 0; index < data.length + 1; index++) {
            const element = data[index];
            if (data.length === index || element.text === '\n') {
                final.push(TagsToPrompt(data.slice(lastStart, index), positive));
                lastStart = index + 1;
            }
        }
        // 在每一句的末尾写入一个逗号，这样会比较好
        return final.join(',\n');
    } else {
        return TagsToPrompt(
            data.filter((i) => i.text !== '\n'),
            positive
        );
    }
};

/** 守卫类型正确 */
export const CreateIData = (data: ITagData) => {
    if (data.text === undefined) data.text = data.en;
    if (data.en === undefined) data.en = data.text;
    if (data.cn === undefined) data.cn = data.text;
    // console.log(data);
    return data;
};
