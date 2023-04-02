/** 直接使用了搜索 emoji 的服务，但是速度有点。。。😂 */
export const searchEmoji = async (words: string) => {
    return fetch(`https://api.emojisworld.fr/v1/search?q=${words}`)
        .then((res) => res.json())
        .then((res) => res.results as { emoji: string }[]);
};
