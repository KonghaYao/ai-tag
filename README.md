# 魔导绪论

[AI 魔咒生成器](https://magic-tag.netlify.app/#/), 使用由 B 站 UP 主 [十二今天也很可爱](https://www.bilibili.com/video/BV1m84y1B7Ny/?p=1&t=285&vd_source=a2ecd44ec8a0a62c70f8b98747f4aa56) 提供的 4 万个 tag 并提供中文检索，方便魔法师们直接使用。

中文翻译为谷歌机翻，可能比较水，就当英文翻译题好了。

默认为青少年模式，但是违禁词过滤估计还会有漏网之鱼，请多多提 issue；模式则可以通过设置面板调整 (\*^\_^\*)。

# 打包流程

```sh
pnpm i
pnpm dev # 开发者模式查看
pnpm build # 打包版本
node ./scripts/swearFilter.mjs # 对敏感词进行标记
```

## TODO

-   [x] 自主添加 tag
-   [x] 分享功能
-   [x] 设置面板
-   [x] 青少年模式
-   [x] csv 预先压缩 Netlify 设置压缩即可
-   [ ] tag 收藏栏
