import { useContext } from 'solid-js';
import { Data } from '../../App';
import { useTranslation } from '../../../i18n';
import { FloatPanel } from '@cn-ui/core';
import { MainGridOfInner } from '../../Panels/HomePanel';
import { Animate } from '@cn-ui/animate';

/** 主页面板的直接展示，免得打开太麻烦 */
export const MainFloat = () => {
    const { visibleId, iconBtn } = useContext(Data);
    const { t } = useTranslation();

    return (
        <FloatPanel
            popup={({ show, TailwindOriginClass }) => (
                <Animate
                    trigger={show}
                    extraClass={'animate-duration-300 ' + TailwindOriginClass}
                    anime="scale"
                >
                    <div class="blur-background pointer-events-auto flex flex-col gap-2 rounded-md p-2">
                        <nav class="flex justify-end">
                            <div class="font-icon btn" onclick={() => visibleId('')}>
                                apps
                            </div>
                        </nav>
                        <div class="grid w-48 grid-cols-3 gap-2">
                            <MainGridOfInner></MainGridOfInner>
                        </div>
                    </div>
                </Animate>
            )}
        >
            <div class="btn m-0 h-full  w-full bg-green-700">
                {iconBtn() ? 'apps' : t('toolbar1.Home')}
            </div>
        </FloatPanel>
    );
};
