import { IData } from '../App';
import { stringToTagData } from '../utils/stringToTags';

/** 将字符串转化为 Tag 数组 */

export const stringToTags = (s: string, list: IData[]): IData[] => {
    const data = stringToTagData(s);
    // console.log(data, s);
    return data.map((i) => {
        const en = list.find((it) => i.text === it.en);
        if (en) return { ...en, emphasize: i.emphasize };
        const cn = list.find((it) => i.text === it.cn);
        if (cn) return { ...cn, emphasize: i.emphasize };
        return {
            en: i.text,
            cn: i.text,
            count: Infinity,
            r18: 0,
            emphasize: i.emphasize,
        };
    });
};
/** 将用户的 Tag 转化为字符串 */

export const TagsToString = (data: IData[], en = true) => {
    return data
        .map((i) => {
            return '{'.repeat(i.emphasize) + (en ? i.en : i.cn) + '}'.repeat(i.emphasize);
        })
        .join(',');
};
