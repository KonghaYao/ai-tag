import { useEffectWithoutFirst, type Atom } from '@cn-ui/reactive';

/**
 * 同步 Atom 到 localStorage 中，保证页面重载数据也可以被查看到,
 * 默认为 JSON 方式进行存储
 * @dev
 * @link @cn-ui/use
 */
export const localSync = <T>(
    at: Atom<T>,
    key: string,
    opts?: Partial<{
        immediately: boolean;
        parse: (s: string) => T;
        stringify: (res: T) => string;
        /** 当 localStorage 没有数据时 */
        fallback: () => void;
    }>
): Atom<T> => {
    const parser = opts?.parse ?? ((s: string) => JSON.parse(s));
    const stringify = opts?.stringify ?? ((s: T) => JSON.stringify(s));
    if (opts?.immediately ?? true) {
        const res = localStorage.getItem(key);
        if (res === null) {
            opts?.fallback && opts.fallback();
        } else {
            at(parser(res));
        }
    }
    useEffectWithoutFirst(() => {
        localStorage.setItem(key, stringify(at()));
    }, [at]);
    return at;
};
