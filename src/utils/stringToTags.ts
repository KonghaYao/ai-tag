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

/** 有点小 BUG 但是问题不大, 从整串中获取子串 */
export const stringToTagData = (s: string, baseEm = 0): PreData[] => {
    s += ',';
    let lel = [...'({[（']; //声明左括号的数组
    let rgl = [...')}]）']; //声明右括号的数组
    let splitSymbol = [...',，']; //声明右括号的数组

    let lastStopCursor = 0;
    let emphasizeCount = 0; // 记录平台基础值

    let piece: string[] = [];
    for (let i = 0; i < s.length; i++) {
        if (i !== s.length - 1) {
            const item = s[i];
            if (splitSymbol.includes(item) && emphasizeCount === 0) {
                piece.push(s.slice(lastStopCursor, i + 1));
                lastStopCursor = i + 1;
            } else if (lel.includes(s[i])) {
                item === '[' ? emphasizeCount-- : emphasizeCount++;
            } else if (rgl.includes(s[i])) {
                item === ']' ? emphasizeCount++ : emphasizeCount--;
                if (emphasizeCount === 0) {
                    piece.push(s.slice(lastStopCursor, i + 1));
                    lastStopCursor = i + 1;
                }
            }
        }
    }
    if (emphasizeCount === 0 && lastStopCursor !== s.length) piece.push(s.slice(lastStopCursor));

    return piece
        .filter((i) => i !== ',')
        .flatMap((i) => {
            if (i.length === 0) return [];
            let a = 0;
            let b = i.length - 1;
            let emphasize = 0;
            let count = 0;
            let start = [];
            while (a < b) {
                const left = i[a];
                if (left === ' ' || splitSymbol.includes(left)) {
                    a++;
                    continue;
                } else if (lel.includes(left)) {
                    start.push(a);
                    left === '[' ? emphasize-- : emphasize++;
                    count++;
                    a++;
                }
                const right = i[b];
                if (right === ' ' || splitSymbol.includes(right)) {
                    b--;
                } else if (rgl.includes(right)) {
                    if (count === 0) break;
                    b--;
                    count--;
                } else {
                    break;
                }
            }

            a = count === 0 ? a : start.at(-1 * count);
            emphasize = count === 0 ? emphasize : emphasize - count;
            if (a === b + 1) return [];

            const text = i.slice(a, b + 1);

            if (text.includes(',')) {
                return stringToTagData(text, emphasize);
            }
            return [{ text, emphasize: emphasize + baseEm }];
        });
};
// globalThis.s = stringToTagData;
