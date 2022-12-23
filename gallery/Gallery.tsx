import { useContext } from 'solid-js';
import { GalleryGlobal } from './App';
import { ScrollLoading } from './ScrollLoading';
import { PictureCard } from './GalleryColumn';
import { WaterFall } from '@cn-ui/core';
import { reflect, useBreakpoints } from '@cn-ui/use';
export const Gallery = () => {
    const { showingData, page, changePage } = useContext(GalleryGlobal);
    const images = reflect(() =>
        showingData()
            .flat()
            .filter((i) => i)
    );

    const { size } = useBreakpoints();
    const columns = reflect(() => {
        switch (size()) {
            case 'md':
                return 3;
            case 'lg':
                return 3;
            case 'xl':
                return 4;
            case '2xl':
                return 4;
            default:
                return 2;
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
