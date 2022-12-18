import { useContext } from 'solid-js';
import { Data } from '../../App';
import { useTranslation } from '../../../i18n';
import { FloatPanel } from '../../components/FloatPanel';
import { MainGridOfInner } from '../../Panels/HomePanel';

/** 主页面板的直接展示，免得打开太麻烦 */

export const MainFloat = () => {
    const { visibleId, iconBtn } = useContext(Data);
    const { t } = useTranslation();

    return (
        <FloatPanel
            class="btn h-full bg-green-700"
            popup={
                <div class="flex flex-col gap-2">
                    <nav class="flex justify-end">
                        <div class="font-icon btn" onclick={() => visibleId('')}>
                            apps
                        </div>
                    </nav>
                    <div class="grid w-48 grid-cols-3 gap-2">
                        <MainGridOfInner></MainGridOfInner>
                    </div>
                </div>
            }
        >
            <span class="h-full w-full">{iconBtn() ? 'apps' : t('toolbar1.Home')}</span>
        </FloatPanel>
    );
};
