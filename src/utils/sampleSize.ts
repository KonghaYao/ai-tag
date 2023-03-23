import type { ITagData } from '../app/main/App';
import { sampleSize as _sampleSize } from 'lodash-es';

/** 重新设计的随机函数, 很明显，数量大的 tag 的支持度更高，所以使用排序手法 */

export const sampleSize = (list: ITagData[], size: number) => {
    const number = Math.ceil(size / 4);
    const one = _sampleSize(list.slice(0, 1000), number);
    const two = _sampleSize(list.slice(1000, 10000), number);
    const three = _sampleSize(list.slice(10000, 20000), number);
    const four = _sampleSize(list.slice(20000), number);
    return [...one, ...two, ...three, ...four].sort((a, b) => b.count - a.count);
};
