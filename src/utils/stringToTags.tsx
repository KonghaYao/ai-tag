import { trim } from 'lodash-es';

/** 将字符串转化为 tags */
export const stringToTags = (s: string) => {
    return s
        .split(',')
        .map((i) => {
            return trim(i, ' ({})');
        })
        .filter((i) => i);
};
