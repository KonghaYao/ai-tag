export const useHistory = <T>() => {
    const info: T[] = [];
    let cursor = 0; // 注意 cursor 指向 length 时，表示现在的位置
    return {
        now() {
            return info[cursor];
        },
        back(step = 1) {
            cursor -= step;
            if (cursor === 0) {
                return false;
            }
            if (cursor <= -1) {
                cursor = -1;
            }
            console.log(cursor);
            return info[cursor];
        },
        go(step = 1) {
            cursor += step;
            if (cursor === info.length - 1) {
                return false;
            }
            if (cursor > info.length) {
                cursor = info.length;
            }
            console.log(cursor);
            return info[cursor];
        },
        addToHistory(item: T, moveForward = true) {
            info.length = cursor + 1;
            if (item === info[info.length - 1]) {
                return false;
            }
            info.push(item);
            moveForward && (cursor = info.length);
        },
    };
};
