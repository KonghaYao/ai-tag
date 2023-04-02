import { Atom, atom } from '@cn-ui/reactive';
import { batch } from 'solid-js';
import { createMemo } from 'solid-js';

const dumpIndex = <T>(step: number, arr: T[]) => {
    let index =
        step > 0
            ? step - 1 // move forward
            : arr.length + step; // move backward
    if (index >= arr.length - 1) {
        index = arr.length - 1;
    }
    if (index < 0) {
        index = 0;
    }
    return index;
};

const split = <T>(step: number, targetArr: T[]) => {
    const index = dumpIndex(step, targetArr);
    return {
        _current: targetArr[index],
        _before: targetArr.slice(0, index),
        _after: targetArr.slice(index + 1),
    };
};

export function useHistoryTravel<T>(watchAtom: Atom<T>, maxLengthNum = 0) {
    const present = watchAtom;
    const past = atom<T[]>([]);
    const future = atom<T[]>([]);

    const reset = () =>
        batch(() => {
            future([]);
            past([]);
        });

    const _forward = (step: number = 1) => {
        if (future.length === 0) return;
        const { _before, _current, _after } = split(step, future());
        batch(() => {
            present(() => _current);
            past((i) => [...i, present(), ..._before]);
            future(_after);
        });
    };

    const _backward = (step: number = -1) => {
        if (past.length === 0) return;
        const { _before, _current, _after } = split(step, past());
        batch(() => {
            present(() => _current);
            past(_before);
            future((i) => [..._after, _current, ...i]);
        });
    };

    const go = (stepNum: number) => {
        if (stepNum === 0) return;
        if (stepNum > 0) return _forward(stepNum);
        _backward(stepNum);
    };

    return {
        /**
         * @readonly 请使用 addToHistory 进行更改
         */
        now: createMemo(() => present()),
        past,
        future,
        go,
        addToHistory(val: T) {
            const _past = [...past(), present()];
            if (maxLengthNum > 0 && _past.length > maxLengthNum) _past.splice(0, 1);
            batch(() => {
                present(() => val);
                future([]);
                past(_past);
            });
        },
        back: () => go(-1),
        forward: () => go(1),
        reset: reset,
    };
}
