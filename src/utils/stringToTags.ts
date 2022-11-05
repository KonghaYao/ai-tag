import { trim } from 'lodash-es';
export interface PreData {
    text: string;
    emphasize: number;
    weight?: string;
    alternatingArr?: string[];
    fromTo?: [string, string];
}
/** 简单抽取，将魔咒串转化为 tags */
export const easyStringToTags = (s: string) => {
    return s
        .split(',')
        .map((i) => {
            return trim(i, ' ({})');
        })
        .filter((i) => i);
};
