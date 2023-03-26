export const splitTextToAutoComplete = (text: string) => {
    const stopChar = ' ,.;|/?？。，；';
    let index = text.length - 1;
    for (; index > 0; index--) {
        const element = text[index];
        if (stopChar.includes(element)) break;
    }
    // console.log(index);
    return [text.slice(0, index), text.slice(index)];
};
