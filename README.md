![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/header.png)

# 魔导绪论

[AI 魔咒生成器](https://magic-tag.netlify.app/#/), 使用由 B 站 UP 主 [十二今天也很可爱](https://www.bilibili.com/video/BV1m84y1B7Ny/?p=1&t=285&vd_source=a2ecd44ec8a0a62c70f8b98747f4aa56) 提供的 4 万个 tag 并提供中文检索，并提供了魔咒社区方便魔法师们直接复制生成。永远免费，永无广告，无商业。

### v2 版本更新内容

-   [x] 使用 Netlify 的云函数提供更为快速的社区数据操作！（暂时不知道花费多少）
-   [x] 查看自己的反馈信息。链接 Github Issues。
-   [x] 考虑剥离词库为单独仓库，采用 jsDelivr 提供的缓存，词库已经单独分配到 [Tags 收集整理项目](https://github.com/KonghaYao/tag-collection) 管理。
-   [x] 抽离魔咒解析库到 NPM，[promptor](https://npm.io/promptor) ，[Github 仓库](https://github.com/KonghaYao/promptor)，已经通过测试！
-   [x] 联合 [Web 字体网站](https://chinese-font.netlify.app/#/home)，使用中文（江西拙楷 2.0）和英文 （aclonica）字体
-   [x] [独立画廊页面](https://magic-tag.netlify.app/gallery.html#/)，直接看图。

## 魔导绪论指南

### 基础操作讲解

1. 选择适合的词汇，点击选中

![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/Pick.gif)

2. 在加权模式下，左点加权，右点减权（减权模式相反）

![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/addAndSub.gif)

3. 不想要某个词汇了：点击删除模式，点击不想要的词汇即可

![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/delete.gif)

4. 拖拽可以移动词汇

![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/Move.gif)

5. 一键复制，魔咒导入，不用多说了吧！
6. 画廊中有可以直接使用的模板，点击复制魔法可以直接导入 tag，而融合魔法则会融入你的 tag。如果你想，你也可以在上面分享你的 tags 和图片！

![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/Gallery.gif)

> 因为是免费服务，所以服务器稳定性不高，请耐心等待。

## 功能列表

> 多多点赞，我就多多更新 (● ∀ ●)。

-   Tag 编辑器
    -   [x] tag 加减权，删除，一键复制导入，自主创建
    -   [x] 绑定 tags，网页 URL 指向了你的魔咒
    -   [x] 搜索标签排除
    -   [x] 魔咒导入
    -   [x] 简易魔咒生成器
    -   [x] 搜索卡顿消除（采用 Worker）
    -   [x] tag 符号 `{}` `()` 切换
    -   [x] 支持 [数值加权](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#attentionemphasis) ,[Prompt editing](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing), [Alternating Words](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#alternating-words), （Stable Diffusion 专有）
    -   [ ] NAI 和 SD 魔咒等值交换
-   系统方面
    -   [x] 设置面板可以更改系统参数
    -   [x] 本地化设置参数
    -   [x] 青少年模式
-   部署方面
    -   [x] csv 预先压缩：Netlify 设置压缩即可
    -   [x] 使用 Netlify 云函数 + Notion 后台
-   社区方面
    -   [x] 分享模式，社区魔咒查看
    -   [x] 添加社区图片直接预览
    -   [x] 社区魔咒复制！
    -   [x] 社区魔咒融合！（非词汇融合）
    -   [x] 社区分页
    -   [x] 社区搜索
-   反馈信息
    -   [x] Bug 反馈
    -   [x] 违禁词反馈
-   网站样式
    -   [x] Iframe 通道通信
    -   [ ] 白昼模式

![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/header2.png)

### 明白魔导绪论的原理

1. 魔导绪论的文件都是静态文件，没有 api，别攻击了，数据都在 Github 上了。
2. 魔导绪论有一个庞大的标签列表，在 [Tags 收集整理项目](https://github.com/KonghaYao/tag-collection)。
3. 魔导绪论在此基础上实现了 tags 的查询操作，数据化魔咒支持加减权操作等。
4. 魔导绪论需要一个 **支持 tags 的 AI 图片生成工具**，这个就自行查找吧。
5. 如果你对具体的 tag 的意义有学习的想法，建议阅读
    - [UP 主 胧雨夜 的 Novel AI 教程](https://www.bilibili.com/video/BV1Le4y1E792/?p=1&t=1304) [网页文本](https://www.yuque.com/longyuye/lmgcwy)
    - [如何与 AI 乙方沟通 —— 细节生成法](https://magic-tag.notion.site/AI-41525facc3ff4874b09973f1c5b33945)
6. 中文翻译为谷歌机翻，可能比较水，就当英文翻译题好了。 搜索功能可能有时抽风，比如白发，你搜头发是搜不到的，这是搜索算法的问题，换种搜法就好了。
7. 为啥每次搜索的结果最多看到 500 （或者更多），因为 这些标签内没找到，要不是没有，就是搜索词不对，所以为了节省性能，没有显示。
8. 默认为青少年模式，但是违禁词过滤估计还会有漏网之鱼，请多多提 issue；**模式则可以通过设置面板调整** (\*^\_^\*)。
9. 由于没钱买服务器，所以我用我的 notion 数据库作为了后端帮助大家存储公开魔咒。Notion 只能进行上传和查询操作，所以公开的魔咒是只能由我改动，可以提交 issues，同时也没有用户系统，大家都是一样的，也算是部分 Web 3 了吧，哈哈哈。[Notion 页面](https://magic-tag.notion.site/90b7c1bb6ad7446ba66e0b1d8ec1d535?v=4cd4db0491664d25a25107631a6f3803)

10. 图片存储在 thumbsnap 网站，提供了非常好的图片加载速度，足够社区使用。另外，如果没有显示出图片，那么非常有可能你开了某个代理，关掉就可以了。（我就是这样）[关于图片网速的测试](https://github.com/KonghaYao/ai-tag/issues/7#issuecomment-1297947958)
11. 关于魔咒的符号问题，两个家族 —— Novel AI 和 Stable Diffusion 采用了不同的符号机制，但是有共同之处。魔导绪论采用的方案是所见即所得，魔咒如代码，是给人看的，保证你在上面编辑的数据复制后是一致的。
    1. 如果你想要 **数值加权**、`|` 融合、`AND` 写法，那么直接写在搜索栏然后创建吧，魔导绪论不能识别他们，但是可以保证复制后是正确的。（如遇 BUG 请提交 issues）

### 使用魔导绪论绘制你想要的图片

> 使用魔导绪论并按照下面的流程，简单高效生成美图！
>
> 下面的所有英文都是复制的，魔导绪论相当于高效的翻译工具

1. 使用基础的大范围的描述质量的标签，如 masterpiece，highly detailed，best quality 等标签
2. 首先你需要想象你需要绘制的图形，AI 也要知道具体的描述和足够数量的训练支持才能够绘制精美的图像
3. 选择你的背景，可以为 海洋，城堡，天空等，直接在魔导绪论输入你的词，然后选中即可
    1. 背景是一类较为综合的概括，配合前面的高质量描述，就可以得到很好看的风景图了 (highly detailed,best quality,ocean)
       ![highly detailed,best quality,ocean](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/highly%20detailed,best%20quality,ocean%20s-3970917509.png)
    2. 当然你可以添加其他的元素进行进一步优化。
4. 如果你是绘制二次元人物肖像，那么可以思考人物的形象。如果无从下手，那么我们可以从下面的路径进行思考。
    1. 全身 or 半身？full body | upper body
    2. 头发如何？试着搜索 绿色的头发 | 短发 | 直发
    3. 五官如何？蓝眼睛 | 眼镜 | open mouth | 脸红
    4. 穿什么衣服？洛丽塔 | maid
        1. 如果详细到上衣，裤子的话，建议详细查找相应的物品
    5. 指定鞋子，凉鞋 | 赤脚

> 现在，我们就有了较为合理的图像画面了，但是细节部分仍然需要进行调整。
> highly detailed,best quality,ocean,green hair,short hair,straight hair,blue eyes,glasses,full body,open mouth,blush,lolita fashion,sandals,barefoot,solo

![Picture](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/highly%20detailed,best%20quality,ocean,green%20hair,short%20hair,straight%20hair,blue%20eyes,glasses,full%20body,open%20mouth,blush,lolita%20fashion,sandals,barefoot%20s-3639915976.png)

5. 比如说，我想要的单人，那么我就加个 solo，想要跳舞，那么就加个 dancing。如果觉得海滩穿着洛丽塔不合适，那就换成泳装，朝着你的想象的方向去绘制就对了。

> highly detailed,best quality,ocean,green hair,short hair,straight hair,blue eyes,glasses,full body,open mouth,blush,sandals,barefoot,solo,swimsuit

![Pictures](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/highly%20detailed,best%20quality,ocean,green%20hair,short%20hair,straight%20hair,blue%20eyes,glasses,full%20body,open%20mouth,blush,sandals,barefoot,solo,swimsuit%20s-4247237495.png)

### 一些不推荐的操作

1. 减少类似部位干两件事情，比如说描述手虽然可以左右手不同样，但是 AI 很难分清左右，它极大概率会将两种不同姿势的动作合在一起，这样可能会导致多手。较好的方式是通多强调单手概率大的动作< 手摸头发 >，减权双手动作 < 抱着 >

> 标签翻译成中文了：独奏，精细，高质量，拿着食物，拿着花束，蹲着

![Pictures](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/bad1.png)

2. 多重因素影响。通用型的标签具有非常明显的描述性，但是配合其他的标签会导致混合错误。比如红色的衣服可能会导致鞋子，头发等被染色。这个是由于画师在一幅图像上一般颜色统一，这个被标签之后，AI 认为其他的同色部分也是特征，也就加入了。最好的方法是指定颜色，缩小并稳定色彩范围。

> solo,highly detailed,best quality,red bow,black thighhighs,white dress,bunny background

> ![Pictures](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/bad2.png)

3. 劣质标签干扰。劣质标签导致的原因是低概率的标签没有够的训练集，导致 AI 并不知道它的全貌，所以会施展融合大法。

> solo, 种子，蚊子，兔子背景

> ![Pictures](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/bad3.png)

## 总结

总的来说，AI 画师装备很足，但是没有调优师也是白搭，各自半部讨龙。对于我们来说，我们也需要进一步学习多数 tag 的指向性来确定整个内容的布局特性，是根据想象创建出的产物，AI 只是一支很好的画笔。永远不要把技术当作特权，当自己失去其优势时，锤足嗟叹。向着星辰与深渊！

# 开发者相关

## 开发者与测试的流程

```sh
pnpm i
pnpm i netlify-cli -g # 需要全局安装
netlify functions:serve # 开启 netlify 的调试云函数，主要是社区需要使用
pnpm dev # 开发者模式查看
pnpm build # 打包版本
node ./scripts/swearFilter.mjs # 对敏感词进行标记
```

## 关于社区的搜索方式

社区的搜索方式采用了类似 Github 的高级搜索方式。默认搜索字符串就是搜索标题。

> `灰色`
>
> 标题中包含灰色
>
> `username:=江夏尧`
>
> 指定上传者的名称全等于 `江夏尧`
>
> `username:Top tags:masterpiece 红`
>
> 指定上传者的名称包含 `Top`；魔咒中包含 `masterpiece`；标题中包含 `红`

## Iframe 服务

魔导绪论提供了 iframe 接口可以为不同网站提供魔咒生成操作，主站完全不需要进行任何修改，直接 iframe 嵌入我们的主页，并且进行几十行代码的接口使用，即可与魔导绪论无缝衔接。

### 快速上手

```html
<iframe
    sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-same-origin allow-storage-access-by-user-activation"
    src="https://magic-tag.netlify.app"
></iframe>
```

```js
// comlink 是必须要的依赖
import { wrap, windowEndpoint, proxy } from 'comlink';
const ifr = document.querySelector('iframe');
await new Promise((resolve) => (ifr.onload = resolve));
const app = wrap(windowEndpoint(ifr.contentWindow));

// 监听魔导绪论数据变化，为了安全考虑响应有延迟
await app.onPromptChange(
    proxy((str) => {
        console.log('%cchanged prompts：' + str, 'background-color:green;color:white');
    })
);
// 注入魔咒
await app.inputPrompt('masterpease');
// 获取现在的魔咒
const str = await app.getPrompt();
```

### 原理

1. 我们采用通用的 [MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel) 的方式在网站间传递数据，这个也是常用的网站联合操作。
2. iframe 标签上必须使用 sandbox 属性保证两边网站的安全权限，[具体调配请访问 MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox)。
3. 例子
    1. CodeSandbox 的代码在线演示广泛应用于官网教程网站，也是通过 iframe 方式加载的，详见 [Sandpack 源码](https://github.com/codesandbox/sandpack)
    2. Notion 支持直接导入网站，也是以 iframe 方式。
    3. [XMind](https://github.com/xmindltd/xmind-embed-viewer) 也支持直接在网站联合查看，使用 iframe + MessageChannel 的方式

## Q&A

1. 想要加友链？
    - 直接提交一个 issues 格式随意！或者直接在魔导绪论里面提交反馈！
2. 如何跳转并注入一段魔咒
    - `https://magic-tag.netlify.app/#/?tags={{masterpiece}}` 你看这里的 tags 后面就是魔咒。

# License

这个仓库 GPL 3.0 注意啦，作者不建议商用

社区上传的资源我们采用 [CCO](https://creativecommons.org/share-your-work/public-domain/cc0/) 的方式共享，如果您有疑问可以联系我。
