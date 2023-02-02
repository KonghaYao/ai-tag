import { uniqBy } from 'lodash-es';
import { IData } from '../App';
import { Atom } from '@cn-ui/use';

/** 融合魔法，折叠融合魔咒 */
export const CombineMagic = (input: IData[], old: IData[]) => {
    // 折叠融合，这样才符合 tags 的先后顺序
    const newArr = [];
    while (old.length || input.length) {
        newArr.length && newArr.push(old.shift());
        input.length && newArr.push(input.shift());
    }
    return uniqBy(newArr.filter(Boolean), (a) => a.en);
};
