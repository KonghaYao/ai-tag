import { IData } from '../App';
import { stringToTagData, PreData } from '../utils/stringToTags';

const stringParserDecorator = (data: PreData) => (
    [
        // Prompt editing
        (data: PreData) => {
            if (data.emphasize <= -1) {
                const [_, from, to, weight] = data.text.match(/([^:]+):([^:]*):([\d\.]+)/) ?? [];
                if (_) {
                    data.weight = weight;
                    data.fromTo = [from, to];
                    data.emphasize++;
                    return true;
                } else {
                    const [_, to, weight] = data.text.match(/([^:]+):([\d\.]+)/) ?? [];
                    if (_) {
                        data.emphasize++;
                        data.weight = weight;
                        data.fromTo = ['', to];
                        return true;
                    }
                }
            }
            return false;
        },
        // 数值权重修饰
        (data: PreData) => {
            if (data.emphasize >= 1) {
                const [_, key, weight] = data.text.match(/(.+):([\d\.]+)/) ?? [];
                if (_) {
                    data.weight = weight;
                    data.text = key;
                    data.emphasize--;
                    return true;
                }
            }
            return false;
        },
        // 可选融合
        (data: PreData) => {
            if (data.emphasize <= -1) {
                if (data.text.includes('|')) {
                    data.emphasize++;
                    data.alternatingArr = data.text.split('|').map((i) => i.trim());
                    return true;
                }
            }
            return false;
        },
    ].some((i) => {
        return i(data);
    }),
    data
);

function pick<T extends Object, Keys extends (keyof T)[]>(obj: T, arr: Keys) {
    return arr.reduce((col, cur) => {
        /** @ts-ignore */
        if (obj[cur] !== undefined) col[cur] = obj[cur];
        return col;
    }, {});
}

/** 将字符串转化为 Tag 数组 */
export const stringToTags = (s: string, list: IData[] = []): IData[] => {
    const data = stringToTagData(s);
    // console.log(data, s);
    return data.map((i) => {
        i = stringParserDecorator(i);
        const temp = pick(i, ['emphasize', 'weight', 'alternatingArr', 'fromTo']);
        const en = list.find((it) => i.text === it.en);
        if (en) return { ...en, ...temp };
        const cn = list.find((it) => i.text === it.cn);
        if (cn) return { ...cn, ...temp };
        return {
            en: i.text,
            cn: i.text,
            count: Infinity,
            r18: 0,
            ...temp,
        } as any as IData;
    });
};

const convertToString = (data: IData) => {
    if (data.fromTo && data.fromTo.length === 2 && typeof data.weight === 'string')
        return `[${data.fromTo[0] === '' ? data.fromTo[1] : data.fromTo.join(':')}:${data.weight}]`;
    if (typeof data.weight === 'string') return `(${data.en}:${data.weight})`;
    if (data.alternatingArr && data.alternatingArr.length)
        return `[${data.alternatingArr.join('|')}]`;
    return data.en;
};

/** 将用户的 Tag 转化为字符串 */
export const TagsToString = (data: IData[], positive = '()') => {
    return data
        .map((i) => {
            const count = Math.abs(i.emphasize);
            const tag = i.emphasize > 0 ? positive : '[]';
            return tag[0].repeat(count) + convertToString(i) + tag[1].repeat(count);
        })
        .join(',');
};
