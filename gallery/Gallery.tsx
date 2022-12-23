import { useContext } from 'solid-js';
import { GalleryGlobal } from './App';
import { ScrollLoading } from './ScrollLoading';
import { PictureCard } from './GalleryColumn';
import { WaterFall } from '@cn-ui/core';
import { reflect } from '@cn-ui/use';
import { useWindowResize } from '../src/use/useWindowResize';
export const Gallery = () => {
    const { showingData, page, changePage } = useContext(GalleryGlobal);
    const images = reflect(() =>
        showingData()
            .flat()
            .filter((i) => i)
    );
    const { width } = useWindowResize();
    const columns = reflect(() => {
        const w = width();
        if (w < 300) {
            return 1;
        } else if (w < 600) {
            return 2;
        } else if (w < 1200) {
            return 3;
        } else {
            return 4;
        }
    });
    const { ScrollEvent } = ScrollLoading(() => changePage(page() + 1));
    return (
        <div onscroll={ScrollEvent} class=" flex justify-center overflow-auto px-4">
            <WaterFall items={images} column={columns}>
                {(item, index) => {
                    return <PictureCard {...item} index={index()}></PictureCard>;
                }}
            </WaterFall>
        </div>
    );
};
