import { Atom, createIgnoreFirst } from '@cn-ui/use';

/** 使用本地存储 */
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
                createIgnoreFirst(() => {
                    console.log('存储设置');
                    localStorage.setItem(name, JSON.stringify(value()));
                }, [value]);
            });
        },
    };
};
