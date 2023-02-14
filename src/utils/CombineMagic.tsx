import { uniqBy } from 'lodash-es';
import { IData } from '../App';
import { breakSymbol, isBreakSymbol } from '../use/TagsConvertor';

/** 融合魔法，折叠融合魔咒 */
export const CombineMagic = (input: IData[], old: IData[]) => {
    // 根据断行分为多个 Part，多个 Part 之间进行合并
    const [inputPart, oldPart] = ([input, old] as const).map((i) =>
        i
            .reduce(
                (col, cur) => {
                    if (isBreakSymbol(cur)) {
                        col.push([]);
                    } else {
                        col[col.length - 1].push(cur);
                    }
                    return col;
                },
                [[]] as IData[][]
            )
            .filter((i) => i.length)
    );

    // 两两分段内逻辑合并
    let max = Math.max(inputPart.length, oldPart.length);
    const AllPart = [...Array(max).keys()].map((count) => {
        const a = inputPart[count] ?? [];
        const b = oldPart[count] ?? [];
        if (a.length && b.length) {
            return baseCombineMagic(a, b);
        } else {
            return a.length ? a : b;
        }
    });

    // 重新插入换行符号
    const result = AllPart.flatMap((i, index) => {
        return index === AllPart.length - 1 ? i : [...i, { ...breakSymbol }];
    });
    return uniqBy(result, (a) =>
        a.en === '\n' ? Math.random().toString() + Math.random().toString() : a.en
    );
};
/** 将两个数组差序合并 */
const baseCombineMagic = (input: IData[], old: IData[]): IData[] => {
    // 折叠融合，这样才符合 tags 的先后顺序
    const newArr = [];
    while (old.length || input.length) {
        newArr.length && newArr.push(old.shift());
        input.length && newArr.push(input.shift());
    }
    return newArr.filter(Boolean);
};
