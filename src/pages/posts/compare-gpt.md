---
layout: ../../layouts/MD.astro
---

# 关于 GPT 模型在 Prompt 生成方面的研究

✒️ 江夏尧 | ^5.5.0

## 经验结论

1. GPT 生成文本在描述物体准确度上高于纯粹 Tags 模式
2. Tags 模式的画面风格指向远远精准于 GPT 文本
3. 两者并非是互斥的关系，但是结合两者的优点往往可以将整个 Prompt 的水平提高一个层次。

## 推导与检验

### 先导知识

1. 🤖 GPT 是生成模型，意思是它通过上文生成下文。

> 目前 OpenAI 好用的公开 API 的模型只有 _text-davinci-003_ 和 _gpt-3.5-turbo_。_text-davinci-003_ 在知识类文本生成领域非常强，魔导绪论现阶段内的模型也是这个。而 _gpt-3.5-turbo_ 是经过对话优化的一个版本，这个版本的特点是会说话，特别会说废话 😂，所以聊天可以，查资料还是看 _text-davinci-003_。

2. 📄 Prompt 与绘画工具

> 据我所知，Stable Diffusion 采用的语言解析是 GPT2 的模型，导致 SD 的理解能力其实是不够的，就算描述准确了，对于某些特定的关系还是处理不好。作者笔记本 A 卡，故使用 [飞桨上的 Stable Diffusion](https://aistudio.baidu.com/aistudio/projectdetail/4905623?channelType=0&channel=0) 进行图片生成。对我来说，我不会绘画，连基本的色彩都认识不全，但是我仍然使用这个软件在半年内产出了 近 300 幅图片（图库里面好多耶 😂）。

3. ✨ 使用 Prompt 工具为最新版本的编辑器

> 编辑器自带 Tag 查询和 GPT 模型，我也是一边研究一边改界面 😂。通过最新的界面可以实现 文本和 Tag 混合变换和排列，最后复制到生图软件中。

### 检验实验

1. 实验的描述

> 我使用了以前比较好的一个全 Tag 成品，然后把正面 Tag 交由 GPT 过一遍，Tag 和 GPT Prompt 分别生图 20 张，取最好的几张看看效果。
> （评判标准主要看我喜好，就别期望啥都科学了，老中医科研 😂）
> 原图是这个，在画廊里面可以找到，然后这个图的 Tag 已经是非常稳定的了，属于我的上限之一了。模型换了一个，但是不碍事。

![](https://ik.imagekit.io/dfidfiskkxn/docs/Snipaste_2023-03-30_10-29-03.png?updatedAt=1680143361328)

> ((best quality)),(((flat color))),thick outlines,((limited palette)),medium shot,album cover, professionally color graded,bright soft diffused light,depth of field,((falling petals)),snowy city street,snow ground and tree with light, gorgeous Norwegian girl,cute natural makeup,long wavy blonde hair,freckles,blue eyes
>
> The album cover features a medium shot of a gorgeous Norwegian girl in bright soft diffused light. She has long wavy blonde hair, cute natural makeup, freckles, and blue eyes. The snowy city street in the background is covered with falling petals and snow, and there are trees with light. The image is composed with thick outlines and a limited palette, creating a flat color feel that is professionally color graded. The overall effect is enhanced by the use of depth of field.

2. 实验成果

![](https://ik.imagekit.io/dfidfiskkxn/docs/%E7%BB%84_1.png?updatedAt=1680144979374)

3. 实验分析

-   风格分析：从结果来看，GPT 在转换 Tags 为文本过程中，移动了较为关键的风格词，如 flat color 和 limited palette, 而把 album cover 移动到了最前，导致风格偏向了 album cover 的写实风格。
-   细节差异分析：Tags 模式在飘飞的花瓣、萝莉体型上表现较为准确，而 GPT 的人物更像是少女风格了。（PS: 因为 cute natural makeup 中的 cute 本来有比较强烈的萝莉风格）
