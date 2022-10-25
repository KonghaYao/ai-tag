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

/** 有点小 BUG 但是问题不大 */
export const stringToTagData = (s: string) => {
    let lel = [...'({[（']; //声明左括号的数组
    let rgl = [...')}]）']; //声明右括号的数组
    let splitSymbol = [...',，']; //声明右括号的数组

    let nowString = '';
    let result: { text: string; emphasize: number }[] = [];
    let emphasizeCount = 0;
    for (let i = 0; i < s.length; i++) {
        if (i !== s.length - 1) {
            if (lel.includes(s[i])) {
                emphasizeCount++;
                continue;
            } else if (rgl.includes(s[i])) {
                emphasizeCount--;
                continue;
            }
        }
        if (splitSymbol.includes(s[i]) || i === s.length - 1) {
            if (i === s.length - 1) nowString += s[i];
            nowString = nowString.trim();
            if (nowString) {
                let r = 0;
                let l = 0;
                for (let j = i - 1; j >= 0; j--) {
                    const element = s[j];
                    if (rgl.includes(element)) {
                        l++;
                    } else if (lel.includes(element)) {
                        r++;
                    } else if (splitSymbol.includes(element)) {
                        break;
                    }
                }
                result.push({ text: nowString, emphasize: Math.min(l, r) + emphasizeCount });
            }
            nowString = '';
        } else {
            nowString += s[i];
        }
    }
    return result;
};
globalThis.s = stringToTagData;
