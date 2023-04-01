const artistTypeList = {
    'ukiyo-e': '浮世绘',
    collage: '拼贴',
    dark: '深色',
    detailed: '细节丰富',
    architecture: '建筑艺术',
    scene: '场景',
    impressionism: '印象派',
    portrait: '纵向',
    colorful: '色彩丰富的',
    expressionism: '表现主义',
    monochromatic: '单色',
    surrealism: '超现实主义',
    photography: '摄影',
    whimsical: '天马行空',
    fantasy: '幻想色彩',
    digital: '数字风格',
    vibrant: '朝气蓬勃',
    'magic realism': '魔幻现实主义',
    realism: '现实主义',
    comics: '漫画',
    romanticism: '浪漫主义',
    'sci-fi': '科幻',
    landscape: '横向',
    character: '字符绘画',
    cartoon: '卡通动漫',
    light: '光影',
    installation: '装置艺术',
    'street art': '街头艺术',
    "children's illustration": '儿童插画',
    manga: '漫画',
    horror: '恐怖元素',
    'high contrast': '高对比度',
    'art deco': '装饰艺术',
    angular: '具有角度的绘画',
    flowers: '花卉绘画',
    melanin: 'melanin',
    photorealism: '极度真实画派',
    'low contrast': '低对比度',
    clean: '干净的绘画',
    'flat colors': '平面色彩',
    'pop art': '流行艺术',
    seascape: '海景',
    'still life': '景物艺术',
    'art nouveau': '新艺术', ///
    nudity: '人体艺术',
    psychedelic: '迷幻风格',
    animals: '动物绘画',
    symbolism: '符号主义',
    baroque: '巴洛克风格',
    fashion: '时尚风格',
    pointillism: '点画', ///
    fauvism: '野兽派',
    renaissance: '文艺复兴时期',
    cloudscape: '云朵景观',
    streetscape: '街道景观',
    cityscape: '城市景观',
    figurativism: '比喻主义',
    anime: '动画',

    'magical realism': '魔幻现实主义2',
    'stained glass': '玻璃彩绘',
    nature: '材质', ///
    watercolor: '水彩',
    cubism: '立体主义',
    abstract: '抽象艺术', ///
    sculpture: '雕塑',
    luminism: '外光派', ///
    messy: '凌乱画风',
    space: '宇宙主题',
    primitivism: '原始主义',
    graffiti: '涂鸦',
    'graphic design': '图形设计',
    bauhaus: '包豪斯风格',
    biological: '生物学绘图',
    '3D': '3D',
    fractalism: '分形艺术',
    textile: '纺织品',
    'storybook realism': '故事书',
    Disney: '迪士尼风格',
    gore: '血腥恐怖',
    personality: '有个性的',
    film: '电影',
    texture: '纹理',
    fruit: '水果',
    brutalism: '野蛮主义',
    Caravaggisti: '卡拉瓦乔主义',
};
import { DragPoster } from '@cn-ui/headless';
import { useSelect } from '@cn-ui/use';
import { AV } from '../../api/cloud';
import { For, Show, createContext, createMemo, useContext } from 'solid-js';
import { Atom, atom } from '@cn-ui/use';
import { usePaginationStack } from '@cn-ui/use';
import { ScrollLoading } from '../../app/gallery/ScrollLoading';

export const ArtistPanel = () => {
    console.log('加载');
    const filter = atom<string[]>([]);
    const searchText = atom('');
    const Count = atom(0);
    const { dataSlices, resetStack, next } = usePaginationStack((index, maxPage) => {
        const q = new AV.Query('artist_style');
        if (filter().length) q.containsAll('tags', filter());
        if (searchText()) q.contains('name', searchText());
        return q
            .ascending('name')
            .descending('strength')
            .skip(index * 30)
            .limit(30)
            .findAndCount()
            .then(([a, count]) => {
                maxPage(Math.ceil(count / 30));
                Count(count);
                // console.log(a);
                return a;
            });
    }, {});
    const list = createMemo(() => dataSlices().flat());
    const { ScrollEvent } = ScrollLoading(next);
    return (
        <>
            <header class="w-full py-2 text-center">
                艺术家搜索器
                <a
                    href="https://proximacentaurib.notion.site/e28a4f8d97724f14a784a538b8589e7d?v=42948fd8f45c4d47a0edfc4b78937474"
                    target="_blank"
                >
                    <sup>Power By SDASS</sup>
                </a>
            </header>

            <TypeFilterContext.Provider value={useTypeFilter({ filter })}>
                <nav class="flex w-full gap-1 p-2">
                    <input
                        class="w-full appearance-none bg-slate-700 px-4 text-sm outline-none transition-all "
                        placeholder={'搜索英文名称,点击右侧按钮刷新结果'}
                        type="search"
                        value={searchText()}
                        oninput={(e) => searchText((e.target as any).value)}
                    />

                    <div class="font-icon btn cursor-pointer px-2" onClick={() => resetStack()}>
                        search
                    </div>
                </nav>
                <TypeFilter></TypeFilter>

                <div
                    class=" flex flex-col divide-y divide-slate-600 overflow-auto"
                    onscroll={ScrollEvent}
                >
                    <Show
                        when={Count()}
                        fallback={<div class="w-full text-center">一个都没有</div>}
                    >
                        <div class="w-full text-center">共 {Count()}条结果</div>
                    </Show>
                    <For each={list()}>
                        {(item) => {
                            const { isSelected, changeSelected } = useContext(TypeFilterContext)!;
                            const createTag = () => 'by ' + item.get('name').replace(',', ' ');
                            return (
                                <DragPoster send={(send) => send('ADD_BEFORE', createTag())}>
                                    <div class="flex items-start p-2">
                                        <div
                                            class="bgn w-40 select-all text-xs"
                                            title="可以直接拖拽到编辑区"
                                        >
                                            {createTag()}
                                            <sup class="select-none">{item.get('strength')}</sup>
                                        </div>

                                        <div class="flex flex-1 flex-row-reverse flex-wrap gap-1">
                                            <For each={item.get('tags')}>
                                                {(item: keyof typeof artistTypeList) => {
                                                    return (
                                                        <div
                                                            class="btn text-xs"
                                                            classList={{
                                                                'bg-red-600 text-white':
                                                                    isSelected(item),
                                                            }}
                                                            onclick={() => {
                                                                changeSelected(item);
                                                            }}
                                                        >
                                                            {artistTypeList[item]}
                                                        </div>
                                                    );
                                                }}
                                            </For>
                                        </div>
                                    </div>
                                </DragPoster>
                            );
                        }}
                    </For>
                </div>
            </TypeFilterContext.Provider>
        </>
    );
};
export const TypeFilterContext = createContext<ReturnType<typeof useTypeFilter>>();
const useTypeFilter = (props: { filter: Atom<string[]> }) => {
    const s = useSelect({
        activeIds: props.filter,
        multi: atom(true),
    });
    Object.keys(artistTypeList).forEach((i) => s.register(i, false));
    const hiddenUnCheck = atom(true);
    const filterList = createMemo(() => {
        const selected = props.filter();
        return [
            ...selected.map<[keyof typeof artistTypeList, string]>((i) =>
                /** @ts-ignore ignore: 有点复杂， */
                [i, artistTypeList[i]]
            ),
            ...Object.entries(artistTypeList).filter((i) => !selected.includes(i[0])),
        ];
    });
    return { ...s, filterList, hiddenUnCheck, filter: props.filter };
};
export const TypeFilter = () => {
    const { filterList, filter, hiddenUnCheck, isSelected, changeSelected } =
        useContext(TypeFilterContext)!;
    return (
        <main class="flex flex-wrap gap-1 p-2">
            <Show when={filter().length === 0}>
                <div
                    class="btn bg-sky-600 text-xs text-white"
                    onClick={() => {
                        hiddenUnCheck((i) => !i);
                    }}
                >
                    类型筛选
                </div>
            </Show>
            <For each={filterList()}>
                {(item) => {
                    return (
                        <div
                            class="btn text-xs"
                            classList={{
                                'bg-red-600 text-white': isSelected(item[0]),
                                hidden: hiddenUnCheck() && !isSelected(item[0]),
                            }}
                            onclick={() => {
                                changeSelected(item[0]);
                            }}
                        >
                            {item[1]}
                        </div>
                    );
                }}
            </For>
            <div
                class="btn"
                onClick={() => {
                    hiddenUnCheck((i) => !i);
                }}
            >
                🔺
            </div>
        </main>
    );
};
