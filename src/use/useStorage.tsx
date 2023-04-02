import { Atom, useEffectWithoutFirst } from '@cn-ui/use';
/** 持续向 localStorage 注入参数 */
export const keepStore = <T,>(name: string, atom: Atom<T>, firstInject = true) => {
    try {
        firstInject && atom(JSON.parse(localStorage.getItem(name)!));
    } catch (e) {}
    useEffectWithoutFirst(() => {
        localStorage.setItem(name, JSON.stringify(atom()));
    }, [atom]);
};
/** 对一个响应式对象, 使用本地存储的数据,主动注入和备份 */
export const useStorage = (data: { [name: string]: Atom<any> }) => {
    return {
        recover() {
            Object.entries(data).map(([name, value]) => {
                const old = localStorage.getItem(name);
                if (old !== null) value(JSON.parse(old));
            });
        },
        tracking() {
            Object.entries(data).map(([name, value]) => {
                useEffectWithoutFirst(() => {
                    console.log('存储设置');
                    localStorage.setItem(name, JSON.stringify(value()));
                }, [value]);
            });
        },
    };
};
