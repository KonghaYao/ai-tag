import { ScrollLoading } from './ScrollLoading';
import { PictureCard } from './GalleryColumn';
import { WaterFall } from '@cn-ui/core';
import { Atom, reflect, useBreakpoints } from '@cn-ui/use';
import { GlobalData } from '../../store/GlobalData';
import type { StoreData } from '../../api/notion';

const rebuildArray = () => {
    const { showingData } = GlobalData.getApp('gallery');
    const { size } = useBreakpoints();
    /** 根据屏幕长度转换列数 */
    const columns = reflect((): number => {
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
    /** 显示的图片 */
    const images = reflect(() => {
        const data = showingData()
            .flat()
            .filter((i) => i);

        // 横竖图片排序算法
        let vertical: StoreData[][] = [...Array(columns()).keys()].map((i) => []);
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
        let final: StoreData[] = [];
        for (let i = 0; i < maxCount; i++) {
            final.push(...vertical.map((i) => i.shift()!));
        }
        return final;
    });
    return { images, columns };
};

export const Gallery = () => {
    const { images, columns } = rebuildArray();
    return (
        <WaterFall
            items={images}
            column={columns}
            class="gap-2 sm:gap-4"
            colClass="gap-2 sm:gap-4"
            fallback={() => <div>没有数据哦</div>}
        >
            {(item, index) => {
                // item 为否定值时，表示为占位符
                if (!item) return null;
                return <PictureCard data={item} index={index!()}></PictureCard>;
            }}
        </WaterFall>
    );
};
