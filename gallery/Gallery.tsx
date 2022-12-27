import { useContext } from 'solid-js';
import { GalleryGlobal } from './App';
import { ScrollLoading } from './ScrollLoading';
import { PictureCard } from './GalleryColumn';
import { WaterFall } from '@cn-ui/core';
import { reflect, useBreakpoints } from '@cn-ui/use';
export const Gallery = () => {
    const { showingData, page, changePage } = useContext(GalleryGlobal);
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
    const images = reflect(() => {
        const data = showingData()
            .flat()
            .filter((i) => i);

        // 横竖图片排序算法
        let vertical = [...Array(columns()).keys()].map((i) => []);
        let heights = Array(columns()).fill(0);
        data.forEach((element) => {
            // 计算高度，并将这个新图片插入到高度累计最小的一列，尽量保证瀑布流高度一致
            const [w, h] = element.size.split('x');
            const heightRate = parseInt(h) / parseInt(w);
            const min = Math.min(...heights);
            const index = heights.indexOf(min);
            heights[index] += heightRate;
            vertical[index].push(element);
        });
        let maxCount = Math.max(...vertical.map((i) => i.length));
        let final = [];
        for (let i = 0; i < maxCount; i++) {
            final.push(...vertical.map((i) => i.shift()));
        }
        return final;
    });

    const { ScrollEvent } = ScrollLoading(() => changePage(page() + 1));
    return (
        <div onscroll={ScrollEvent} class=" flex justify-center overflow-auto px-4 pt-20">
            <WaterFall items={images} column={columns}>
                {(item, index) => {
                    // item 为否定值时，表示为占位符
                    if (!item) return null;
                    return <PictureCard {...item} index={index()}></PictureCard>;
                }}
            </WaterFall>
        </div>
    );
};
