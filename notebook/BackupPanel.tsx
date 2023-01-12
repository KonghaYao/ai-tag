import { useIndexedDB } from './use/useIndexedDB';
import { Tab, Tabs, TabsHeader } from '@cn-ui/core';
import { saveAs } from 'file-saver';

export const BackupPanel = () => {
    const { ExportText, ExportImage } = useIndexedDB();
    return (
        <div class="blur-background fixed top-0 left-0 z-40 h-screen w-screen">
            <main class="m-auto mx-auto my-4 w-full max-w-sm rounded-lg border border-slate-600 p-4">
                <header></header>
                <Tabs activeId="导出">
                    <TabsHeader>
                        {(item) => {
                            return <div class="btn bg-green-600 text-white">{item}</div>;
                        }}
                    </TabsHeader>

                    <Tab id="导出">
                        <div class="bg-green-800 p-2 text-sm text-white">
                            您可以在这里备份您的魔咒笔记。文件备份将保留您的魔咒文本，而图片数据由于太大，所以需要分片单独下载。
                        </div>
                        <section class="flex flex-col gap-4">
                            <div
                                class="btn"
                                onclick={async () => {
                                    const data = await ExportText();
                                    saveAs(data, `魔导绪论导出-${Date.now()}.json`);
                                }}
                            >
                                <span class="font-icon">photo</span>
                                下载魔咒文件
                            </div>
                            <div
                                class="btn"
                                onclick={async () => {
                                    const cb = confirm('将会进行打包分包下载图片');
                                    if (cb) {
                                        const now = Date.now();
                                        await ExportImage(async (data, index) => {
                                            saveAs(data, `魔导绪论图片导出-${now}-${index}.zip`);
                                        });
                                    }
                                }}
                            >
                                <span class="font-icon">photo</span>
                                下载所有图片
                            </div>
                        </section>
                    </Tab>
                </Tabs>
            </main>
        </div>
    );
};
