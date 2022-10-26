// You should import the CSS file.
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
type Options = Viewer.Options;
/**
 * 输入的数据，可以使用 Img 标签
 */
export type ImgData = { alt: string; src: string } | HTMLImageElement;
export const useViewer = (props?: Options) => {
    let images: ImgData[] = [];

    /**
     * ! 别问，问就是黑魔法
     */
    let fakeDom = document.createElement('div');
    /** @ts-ignore */
    fakeDom.querySelectorAll = () => images;

    const createViewer = () => {
        return new Viewer(fakeDom as any, props);
    };
    let viewer: Viewer = createViewer();
    const dataToImg = (i: ImgData) => {
        const img = document.createElement('img');

        return Object.assign(img, i);
    };
    return {
        addImages(image: ImgData[]) {
            images = images.concat(image.map(dataToImg));
            viewer.update();
        },
        replaceImages(newImages: ImgData[]) {
            images = newImages.map(dataToImg);
            viewer.update();
        },
        getViewer() {
            return viewer;
        },
    };
};
