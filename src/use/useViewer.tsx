// You should import the CSS file.
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
type Options = Viewer.Options;
/**
 * 输入的数据，可以使用 Img 标签
 */
export type ImgData = { alt: string; src: string; origin: string };
export const useViewer = (props?: Options) => {
    let images: ImgData[] = [];

    /**
     * ! 别问，问就是黑魔法
     */
    let fakeDom = document.createElement('div');
    /** @ts-ignore */
    fakeDom.querySelectorAll = () => images;

    const createViewer = () => {
        const v = new Viewer(fakeDom as any, props);
        const a = v.view;
        // 懒加载完成
        v.view = (nextIndex: number) => {
            let imagelist = images;
            imagelist[nextIndex].src = imagelist[nextIndex].origin;
            /**@ts-ignore */
            v.images[nextIndex].src = imagelist[nextIndex].origin;
            /**@ts-ignore */
            v.images[nextIndex].dataset.originalUrl = imagelist[nextIndex].origin;
            /**@ts-ignore */
            if (v.items && v.items[nextIndex])
                /**@ts-ignore */
                v.items[nextIndex].firstChild.dataset.originalUrl = imagelist[nextIndex].origin;

            return a.call(v, nextIndex);
        };
        // console.log(v);
        return v;
    };

    let viewer: Viewer = createViewer();
    const dataToImg = (i: ImgData) => {
        const img = new Image();
        img.loading = 'lazy';

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
