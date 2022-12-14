import { IData } from '../App';

import { PromptToTags, TagsToPrompt } from 'promptor';

/** 预处理来源字符出串，将一些字符进行转换 */
export const PreProcess = (s: string) => {
    return s.replace(/_/g, ' ').replace(/\n/g, ',');
};

/** 将字符串转化为 Tag 数组 */
export const stringToTags = (s: string, list: IData[] = []): IData[] => {
    s = PreProcess(s);
    const data = PromptToTags(s);
    return data.map((i) => {
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
        } as IData;
    });
};

/** 将用户的 Tag 转化为字符串 */
export const TagsToString = (data: IData[], positive = '()') => {
    return TagsToPrompt(data, positive);
};

/** 守卫类型正确 */
export const CreateIData = (data: IData) => {
    if (data.text === undefined) data.text = data.en;
    if (data.en === undefined) data.en = data.text;
    if (data.cn === undefined) data.cn = data.text;
    // console.log(data);
    return data;
};
