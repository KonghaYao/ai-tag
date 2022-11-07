import { uniqBy } from 'lodash-es';
import { IData } from '../App';

/** 融合魔法，折叠融合魔咒 */
export const CombineMagic = (input: IData[], usersCollection: any) => {
    usersCollection((i) => {
        // 折叠融合，这样才符合 tags 的先后顺序
        const newArr = [];
        while (i.length || input.length) {
            newArr.length && newArr.push(i.shift());
            input.length && newArr.push(input.shift());
        }

        return uniqBy(
            newArr.filter((i) => i),
            (a) => a.en
        );
    });
};
