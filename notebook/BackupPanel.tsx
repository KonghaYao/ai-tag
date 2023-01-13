import { useIndexedDB } from './use/useIndexedDB';
import { Tab, Tabs, TabsContext, TabsHeader } from '@cn-ui/core';
import { saveAs } from 'file-saver';
import { Panel } from '../src/components/Panel';
import { UploadButton } from '../src/components/UploadButton';
import { Notice } from '../src/utils/notice';
import { useContext } from 'solid-js';

export const BackupPanel = () => {
    return (
        <Panel id="backup">
            <main class="m-auto mx-auto my-4 w-full max-w-sm rounded-lg border border-slate-600 p-4">
                <header class="my-4 text-lg text-white">数据存储系统</header>
                <Tabs activeId="导出">
                    <TabsHeader>
                        {(item) => {
                            const { changeSelected, isSelected } = useContext(TabsContext);
                            return (
                                <div
                                    class="btn text-sm text-white"
                                    classList={{
                                        'bg-red-600': isSelected(item),
                                    }}
                                    onclick={() => {
                                        changeSelected(item, true);
                                    }}
                                >
                                    {item}
                                </div>
                            );
                        }}
                    </TabsHeader>
                    <Export></Export>
                    <Import></Import>
                </Tabs>
            </main>
        </Panel>
    );
};

export const Export = () => {
    const { ExportText, ExportImage } = useIndexedDB();
    return (
        <Tab id="导出">
            <div class="my-2 rounded bg-green-800 p-2 text-sm text-white">
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
    );
};
export const Import = () => {
    const { ImportText, ImportImage } = useIndexedDB();
    return (
        <Tab id="导入">
            <div class="my-2 rounded bg-blue-800 p-2 text-sm text-white">
                导入您导出的文件, 所有导入文件都将会添加到现有数据中来
            </div>
            <section class="flex flex-col gap-4">
                <UploadButton
                    accept="application/json"
                    onUpload={(files) => {
                        ImportText(files[0]).then(() => {
                            Notice.success('导入成功, 刷新页面后显示');
                        });
                    }}
                >
                    <span class="font-icon">photo</span>
                    导入魔咒文件
                </UploadButton>
                <UploadButton
                    multiple
                    onUpload={async (files) => {
                        Notice.success('开始进行导入，请稍等');
                        for (const file of files) {
                            await ImportImage(file);
                            Notice.success('成功导入分片');
                        }
                        Notice.success('全部导入完成，请刷新页面');
                    }}
                >
                    <span class="font-icon">photo</span>
                    导入所有图片
                </UploadButton>
            </section>
        </Tab>
    );
};
