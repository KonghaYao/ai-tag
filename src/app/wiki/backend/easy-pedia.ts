export class EasyPedia {
    searchFor() {}
    adapters = [];
}
export interface PediaShortMessage {
    title: string;
    token: string;
}
export interface PediaExtract {
    title: string;
    /** 原始地址描述 */
    url: string;
    /** 文本缩略描述 */
    extract: string;
    /** 图片描述 */
    images?: { thumbnail: string; url: string }[];
}

abstract class PediaAdapter {
    abstract init(): Promise<void> | void;
    abstract getExtract(token: string): Promise<PediaExtract>;
}

/** 中文维基的访问形式，但是只是简单获取简略信息，以保证能够匹配使用 */
class WikiAdapter implements PediaAdapter {
    init() {}
    async getExtract(token: string) {
        return fetch(
            `https://zh.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=300&explaintext&titles=${token}&format=json`
        )
            .then((res) => res.json())
            .then((res) => ({
                ...((Object.values(res.query.pages)[0] ?? {}) as PediaExtract),
                url: `https://en.wikipedia.org/wiki/` + token,
            }));
    }
}

/** 图片搜索 */
class ImageAdapter implements PediaAdapter {
    token = '';
    async init() {
        return fetch('https://duckduckgo.com/?q=wiki+api&t=h_&iax=images&ia=images')
            .then((res) => res.text())
            .then((res) => {
                const [_, token] = res.match(/vqd=([\d\-]+)/)!;
                this.token = token;
            });
    }
    getExtract(token: string): Promise<PediaExtract> {
        return fetch(`https://duckduckgo.com/i.js?l=wt-wt&o=json&q=${token}&vqd=${this.token}&p=1`)
            .then((res) => res.json())
            .then((res) => {
                return {
                    title: token,
                    url: `https://duckduckgo.com/?q=${token}&t=h_&iax=images&ia=images`,
                    extract: '',
                    images: res.results.map((i: any) => ({ thumbnail: i.thumbnail, url: i.image })),
                };
            });
    }
}
