export const useHistory = <T>() => {
    const info: T[] = [];
    let cursor = -1; // 注意 cursor 指向 length 时，表示现在的位置
    return {
        now() {
            return info[cursor];
        },
        back(step = 1) {
            if (cursor === 0) {
                return false;
            }
            cursor -= step;
            if (cursor <= 0) {
                cursor = 0;
            }
            // console.log(cursor);
            return info[cursor];
        },
        go(step = 1) {
            if (cursor === info.length - 1) {
                return false;
            }
            cursor += step;
            if (cursor >= info.length - 1) {
                cursor = info.length - 1;
            }
            // console.log(cursor);
            return info[cursor];
        },
        addToHistory(item: T, moveForward = true) {
            if (item === info[cursor]) {
                return false;
            }
            info.length = cursor + 1;
            info.push(item);
            // console.log(info);
            moveForward && (cursor = info.length);
        },
    };
};
