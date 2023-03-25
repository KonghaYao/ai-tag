import type { ITagData } from '../app/main/App';
import { plus, minus } from 'number-precision';
import { debounce } from 'lodash-es';
import { GlobalData } from '../store/GlobalData';
import type { Atom } from '@cn-ui/use';

/** tag 内部的加减 */
export const useTagController = ({ usersCollection }: { usersCollection: Atom<ITagData[]> }) => {
    const { deleteMode, emphasizeAddMode, emphasizeSubMode, MaxEmphasize } =
        GlobalData.getApp('data');

    /** 左点击加权，右点击减权 */
    const clickEvent = (item: ITagData, rightClick?: boolean) => {
        // console.log(item);
        if (deleteMode()) {
            return usersCollection((i) => i.filter((it) => it !== item));
        }

        if ((emphasizeAddMode() && !rightClick) || (rightClick && emphasizeSubMode())) {
            // 加权操作
            return usersCollection((arr) => {
                const index = arr.findIndex((it) => it === item);
                const it = arr[index];
                const newArr = [...arr];

                if (it.weight) {
                    newArr[index] = { ...it, weight: plus(it.weight, 1).toString() };
                    return newArr;
                } else if (typeof it.emphasize !== 'number' || it.emphasize < MaxEmphasize()) {
                    newArr[index] = { ...it, emphasize: (it.emphasize ?? 0) + 1 };
                    return newArr;
                }
                return arr;
            });
        }
        if ((emphasizeSubMode() && !rightClick) || (rightClick && emphasizeAddMode())) {
            // 减权操作
            return usersCollection((arr) => {
                const index = arr.findIndex((it) => it === item);
                const it = arr[index];
                const newArr = [...arr];
                if (it.weight) {
                    const weight = minus(it.weight, 1);
                    newArr[index] = { ...it, weight: weight < 0 ? '0.0' : weight.toString() };
                    return newArr;
                } else if (typeof it.emphasize !== 'number' || it.emphasize > -1 * MaxEmphasize()) {
                    newArr[index] = { ...it, emphasize: (it.emphasize ?? 0) - 1 };
                    return newArr;
                }
                return arr;
            });
        }
    };

    /** 滚轮事件，调节对象的数值类型权重 */
    const wheelEvent = debounce((item: ITagData, delta: number) => {
        const diff = delta / 150;
        if (emphasizeAddMode() || emphasizeSubMode()) {
            // console.log(diff);
            if (diff > 0) {
                return usersCollection((arr) => {
                    const index = arr.findIndex((it) => it === item);
                    const it = arr[index];
                    const newArr = [...arr];
                    const weight = plus(it.weight ?? 0, 0.1);
                    newArr[index] = { ...it, weight: weight < 0 ? '0.0' : weight.toString() };
                    return newArr;
                });
            } else {
                // 减权操作
                return usersCollection((arr) => {
                    const index = arr.findIndex((it) => it === item);
                    const it = arr[index];
                    const newArr = [...arr];

                    const weight = minus(it.weight ?? 0, 0.1);
                    newArr[index] = { ...it, weight: weight < 0 ? '0.0' : weight.toString() };
                    return newArr;
                });
            }
        }
    }, 50);
    return { wheelEvent, clickEvent };
};
