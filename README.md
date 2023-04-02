![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/header.png)

# 魔导绪论

[AI 魔咒生成器](https://magic-tag.netlify.app/#/), 最早设计使用了由 B 站 UP 主 [十二今天也很可爱](https://www.bilibili.com/video/BV1m84y1B7Ny/?p=1&t=285&vd_source=a2ecd44ec8a0a62c70f8b98747f4aa56) 提供的 4 万个 tag , 合并 [Novelai 词条百科共享站](https://www.cerfai.com/#/) 的中文翻译，提供中文检索和魔咒生成服务，并提供了魔咒社区方便魔法师们直接复制生成。永远免费，永无广告，无商业 😄。

衍生项目

1. [promptor](https://github.com/KonghaYao/promptor) 纯粹的魔咒解析库。
2. [prompt-extractor](https://npm.io/prompt-extractor)，独立法术解析库 解析 SD，Paddle，NovelAI 三种图片产出信息，并统一格式
3. [tag-collection](https://github.com/KonghaYao/tag-collection) Tag 仓库项目，提供 Tag 数据文件。
4. [独立画廊页面](https://magic-tag.netlify.app/gallery.html#/) 全新画廊页面，使用瀑布流查看社区图片，真爽。

项目联合

1. [Web 字体网站](https://chinese-font.netlify.app/#/home)，使用中文（江西拙楷 2.0）和英文 （aclonica）字体，在设置面板中可以进行默认字体调整。

### v5 计划

-   [ ] 人工智能划分词汇，更加友善的词条分类
-   [ ] 国际化文本：英语，日语（如果有兴趣可以帮助翻译 locales 文件夹下面的文件）。
-   [ ] 自建词库
-   [ ] 白昼模式

## 魔导绪论指南

### 基础操作讲解

> 我在 Notion 写了指南，这里就不写了。请查看 [魔导绪论教程](https://magic-tag.notion.site/ee1a0ab136724eb183a29d1fcc56a3d2)

## 功能列表

> 多多点赞，我就多多更新 (● ∀ ●)。

-   Tag 编辑器
    -   [x] tag 加减权，删除，一键复制导入，自主创建
    -   [x] 绑定 tags，网页 URL 指向了你的魔咒
    -   [x] 搜索标签排除
    -   [x] tag 符号 `{}` `()` 切换
    -   [x] 支持换行符进行分割，SD 不识别换行符，所以可以在文本中使用
    -   [x] 支持 [数值加权](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#attentionemphasis) ,[Prompt editing](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing), [Alternating Words](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#alternating-words), （Stable Diffusion 专有）
-   系统方面
    -   [x] 设置面板可以更改系统参数
    -   [x] 本地化设置参数
    -   [x] 青少年模式 （为了能长久运行 😂）
-   部署方面
    -   [x] CSV 文件静默更新
    -   [x] 使用 Netlify 云函数 + LeanCloud 后台组成社区数据库
    -   [x] 使用 Github Issues 作为反馈后台
-   社区方面
    -   [x] 分享模式
    -   [x] 社区魔咒复制！
    -   [x] 社区魔咒融合！（非词汇融合）
    -   [x] 社区分页
    -   [x] 社区搜索
-   画廊
    -   [x] 联合社区中的图片
    -   [x] 瀑布流布局 😍
-   反馈信息
    -   [x] Bug 反馈
    -   [x] 违禁词反馈
    -   [ ] 反馈信息回调优化
-   网站样式
    -   [x] Iframe 通道通信
    -   [x] 拖拽联合：包括了非常多的拖拽操作与数据联合
    -   [ ] 白昼模式

![](https://cdn.jsdelivr.net/gh/konghayao/ai-tag/assets/header2.png)

# 开发者相关

## 开发者与测试的流程

```sh
pnpm i
pnpm i netlify-cli -g # 需要全局安装
pnpm function # 开启 netlify 的调试云函数，主要是社区需要使用
pnpm dev # 开发者模式查看
pnpm build # 打包版本，一般 Netlify 自动打包

# 注意，调试少数几个面板需要使用环境变量，只有我才有，所以会报错😂

```

## 拖拽通道服务

1. 在浏览器不同页面中可以通过 拖拽来导入或者导出一些东西，比如说 魔导绪论 v4 开始采用 MPA 的方式管理 NoteBook 、Gallery 和主页，这三者都可以通过 `拖拽信道` 进行拖拽信息的交流检测。但是这些操作我还没有汇总出来 😭。

## Q&A

1. 想要加友链？
    - 直接提交一个 issues 格式随意！或者直接在魔导绪论里面提交反馈！

# License

这个仓库 GPL 3.0 注意啦，作者不建议商用

社区上传的资源我们采用 [CCO](https://creativecommons.org/share-your-work/public-domain/cc0/) 的方式共享，如果您有疑问可以联系我。
