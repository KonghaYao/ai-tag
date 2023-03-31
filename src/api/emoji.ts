export const searchEmoji = (words: string) => {
    return fetch(`https://api.emojisworld.fr/v1/search?q=${words}`)
        .then((res) => res.json())
        .then((res) => res.results as { emoji: string }[]);
};
